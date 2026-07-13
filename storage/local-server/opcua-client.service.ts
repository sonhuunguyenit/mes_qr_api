import { Injectable, OnApplicationBootstrap, OnApplicationShutdown, forwardRef, Inject } from '@nestjs/common'
import {
  OPCUAClient,
  ClientSession,
  ClientSubscription,
  AttributeIds,
  TimestampsToReturn,
  DataValue,
  MessageSecurityMode,
  SecurityPolicy,
  UserTokenType,
  DataType,
} from 'node-opcua'
import { InjectRepo } from 'ape-nestjs-typeorm3-kit'
import { Not, IsNull } from 'typeorm'
import { configEnv } from '~/@config/env'
import { DeviceRepo } from '~/domains/primary'
import { NSDevice } from '~/common/enums'
import { LocalServerService } from './local-server.service'

/**
 * OpcUaClientService — tự động khởi động khi NestJS boot.
 */
@Injectable()
export class OpcUaClientService implements OnApplicationBootstrap, OnApplicationShutdown {
  private client: OPCUAClient | null = null
  private session: ClientSession | null = null
  private subscription: ClientSubscription | null = null
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private isShuttingDown = false

  constructor(
    @Inject(forwardRef(() => LocalServerService))
    private readonly localServerService: LocalServerService,
    @InjectRepo(DeviceRepo) private readonly deviceRepo: DeviceRepo,
  ) {}

  // ─── Lifecycle hooks ──────────────────────────────────────────────────────

  onApplicationBootstrap(): void {
    const { OPCUA_ENABLED } = configEnv() as any
    if (!OPCUA_ENABLED) return
    
    // Chạy ngầm (background), KHÔNG dùng await để tránh block tiến trình khởi động của NestJS nếu mạng bị chậm/treo
    this.connect().catch(console.error)
  }

  async onApplicationShutdown(): Promise<void> {
    this.isShuttingDown = true
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer)
    await this.disconnect()
  }

  // ─── Connect / Disconnect ─────────────────────────────────────────────────

  private async connect(): Promise<void> {
    const env = configEnv() as any
    const endpoint: string = env.OPCUA_ENDPOINT
    if (!endpoint) return

    try {
      console.log(`[OPC-UA] Đang kết nối tới ${endpoint}...`)

      this.client = OPCUAClient.create({
        endpointMustExist: false,
        connectionStrategy: {
          initialDelay: 1000,
          maxDelay: env.OPCUA_RECONNECT_DELAY_MS,
          maxRetry: 5,
        },
        securityMode: MessageSecurityMode.None,
        securityPolicy: SecurityPolicy.None,
      })

      this.client.on('connection_lost', () => {
        console.warn(`[OPC-UA] Mất kết nối! Đang thử lại...`)
        this.scheduleReconnect()
      })

      await this.client.connect(endpoint)
      console.log(`[OPC-UA] Kết nối thành công tới ${endpoint}`)

      await this.createSession(env)
      console.log(`[OPC-UA] Đã tạo session`)

      await this.subscribeNodes()
      console.log(`[OPC-UA] Đã theo dõi các node (subscribe)`)
    } catch (error: any) {
      console.error(`[OPC-UA] Lỗi kết nối tới ${endpoint}:`, error?.message || error)
      this.scheduleReconnect()
    }
  }

  private async createSession(env: any): Promise<void> {
    const userIdentity = env.OPCUA_USERNAME
      ? { type: UserTokenType.UserName, userName: env.OPCUA_USERNAME, password: env.OPCUA_PASSWORD }
      : { type: UserTokenType.Anonymous }

    this.session = await this.client!.createSession(userIdentity as any)
  }

  private async subscribeNodes(): Promise<void> {
    const env = configEnv() as any

    const devices = await this.deviceRepo.find({
      where: { tag: Not(IsNull()), isActive: true },
      select: ['id', 'name', 'tag', 'type'],
    })

    if (!devices.length) return

    this.subscription = ClientSubscription.create(this.session!, {
      requestedPublishingInterval: env.OPCUA_SUBSCRIPTION_INTERVAL_MS,
      requestedLifetimeCount: 100,
      requestedMaxKeepAliveCount: 10,
      maxNotificationsPerPublish: 100,
      publishingEnabled: true,
      priority: 10,
    })

    for (const device of devices) {
      const item = await this.subscription.monitor(
        {
          nodeId: device.tag,
          attributeId: AttributeIds.Value,
        },
        {
          samplingInterval: env.OPCUA_SUBSCRIPTION_INTERVAL_MS,
          discardOldest: true,
          queueSize: 10,
        },
        TimestampsToReturn.Both,
      )

      item.on('changed', (dataValue: DataValue) => {
        this.onDataChanged(device.tag, dataValue)
      })
    }
  }

  private async disconnect(): Promise<void> {
    try {
      if (this.subscription) {
        await this.subscription.terminate()
        this.subscription = null
      }
      if (this.session) {
        await this.session.close()
        this.session = null
      }
      if (this.client) {
        await this.client.disconnect()
        this.client = null
      }
    } catch {}
  }

  // ─── Auto-reconnect ───────────────────────────────────────────────────────

  private scheduleReconnect(): void {
    if (this.isShuttingDown) return
    const { OPCUA_RECONNECT_DELAY_MS } = configEnv() as any
    const delay = OPCUA_RECONNECT_DELAY_MS || 5000

    this.reconnectTimer = setTimeout(async () => {
      await this.disconnect()
      await this.connect()
    }, delay)
  }

  // ─── Data handler ─────────────────────────────────────────────────────────

  private onDataChanged(tag: string, dataValue: DataValue): void {
    const raw = dataValue.value?.value
    if (raw === null || raw === undefined) return

    const value = String(raw)
    const timestamp = dataValue.serverTimestamp?.toISOString() ?? new Date().toISOString()

    this.localServerService.handleData({ tag, value, timestamp }).catch(() => {})
  }

  // ─── Direct Write ─────────────────────────────────────────────────────────

  /**
   * Ghi giá trị trực tiếp xuống một tag (nodeId) trên OPC-UA Server
   */
  async writeNodeValue(tag: string, value: any, dataType: DataType = DataType.Boolean): Promise<boolean> {
    if (!this.session) return false

    try {
      const statusCode = await this.session.write({
        nodeId: tag,
        attributeId: AttributeIds.Value,
        value: {
          value: {
            dataType: dataType,
            value: value,
          },
        },
      })
      return statusCode.isGood()
    } catch {
      return false
    }
  }

  /**
   * Gửi lệnh điều khiển và tự động ánh xạ sang giá trị ghi tương ứng
   */
  async writeCommand(tag: string, cmd: NSDevice.ECmd, payload?: Record<string, any>): Promise<boolean> {
    let value: any = true
    let dataType = DataType.Boolean

    switch (cmd) {
      case NSDevice.ECmd.BARRIER_OPEN:
        value = true
        dataType = DataType.Boolean
        break
      case NSDevice.ECmd.BARRIER_CLOSE:
        value = false
        dataType = DataType.Boolean
        break
      case NSDevice.ECmd.BARRIER_STOP:
        value = true
        dataType = DataType.Boolean
        break
      case NSDevice.ECmd.DISPLAY_SHOW:
      case NSDevice.ECmd.SPEAKER_PLAY:
        value = payload?.text || ''
        dataType = DataType.String
        break
      case NSDevice.ECmd.SCALE_READ:
        value = true
        dataType = DataType.Boolean
        break
      default:
        value = true
        dataType = DataType.Boolean
    }

    return this.writeNodeValue(tag, value, dataType)
  }
}
