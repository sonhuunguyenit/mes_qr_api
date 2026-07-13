import { Injectable, OnApplicationBootstrap, OnApplicationShutdown, Logger, forwardRef, Inject } from '@nestjs/common'
import { io, Socket } from 'socket.io-client'
import { configEnv } from '~/@config/env'
import { LocalServerService } from './local-server.service'

/**
 * CLIENT SOCKET
 * Chạy trên Local PC. Kết nối lên Cloud Server.
 * Yêu cầu: yarn add socket.io-client
 */
@Injectable()
export class LocalServerClient implements OnApplicationBootstrap, OnApplicationShutdown {
  private socket: Socket
  private readonly logger = new Logger(LocalServerClient.name)

  constructor(
    @Inject(forwardRef(() => LocalServerService))
    private readonly localServerService: LocalServerService,
  ) {}

  onApplicationBootstrap() {
    const env = configEnv() as any
    // Trỏ tới namespace /device của Cloud Server
    const serverUrl = env.CLOUD_SERVER_URL || 'http://localhost:3000/device'

    console.log(`[Local PC] Connecting to Cloud Server: ${serverUrl}...`)

    this.socket = io(serverUrl, {
      reconnectionDelayMax: 10000,
    })

    this.socket.on('connect', () => {
      console.log(`[Local PC] Connected to Cloud Server! Socket ID: ${this.socket.id}`)
    })

    this.socket.on('disconnect', () => {
      console.warn(`[Local PC] Disconnected from Cloud Server`)
    })

    // Lắng nghe lệnh từ mây quăng xuống (Cloud gọi server.emit('plc-command'))
    this.socket.on('plc-command', (payload) => {
      console.log(`[Local PC] Nhận lệnh từ Server mây: ${JSON.stringify(payload)}`)
      this.localServerService.handleCommandFromServer(payload)
    })
  }

  onApplicationShutdown() {
    if (this.socket) {
      this.socket.disconnect()
    }
  }

  /**
   * Đẩy dữ liệu PLC (Local PC đọc được) lên Server mây
   */
  emitPlcData(payload: any) {
    if (this.socket?.connected) {
      this.socket.emit('plc-data', payload)
    }
  }

  /**
   * Báo cáo kết quả lệnh lên Server mây
   */
  emitPlcResultCommand(payload: any) {
    if (this.socket?.connected) {
      this.socket.emit('plc-result-command', payload)
    }
  }
}
