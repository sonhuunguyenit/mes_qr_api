import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { NSDevice } from '~/common/enums'
import { OpcUaClientService } from './opcua-client.service'
import { LocalServerClient } from './local-server.client'

export type PlcDataPayload = {
  tag: string
  value: string
  timestamp?: string
}

export type PlcCommandPayload = {
  tag: string
  cmd: NSDevice.ECmd
  payload?: Record<string, unknown>
}

@Injectable()
export class LocalServerService {
  constructor(
    @Inject(forwardRef(() => OpcUaClientService))
    private readonly opcUaClient: OpcUaClientService,
    @Inject(forwardRef(() => LocalServerClient))
    private readonly localServerClient: LocalServerClient,
  ) {}

  /**
   * [FLOW: PLC → Local PC → Cloud Server]
   * OPC-UA Client (chạy tại Local PC) đọc được data từ PLC, gọi vào hàm này.
   * Ta sẽ bắn data này qua Socket lên Cloud Server.
   */
  async handleData(payload: PlcDataPayload): Promise<void> {
    console.log(`[Local PC] Đọc data từ PLC: ${payload.tag} = ${payload.value}`)
    this.localServerClient.emitPlcData(payload)
  }

  /**
   * [FLOW: Cloud Server → Local PC → PLC]
   * Server mây bắn lệnh xuống, Local PC nhận được ở đây.
   * Ta sẽ dùng OPC-UA ghi lệnh này trực tiếp xuống PLC.
   */
  async handleCommandFromServer(payload: PlcCommandPayload): Promise<void> {
    const { tag, cmd, payload: extraData } = payload
    
    console.log(`[Local PC] Nhận lệnh từ Cloud: Ghi xuống PLC tag ${tag}, cmd ${cmd}`)
    
    // Ghi xuống PLC (qua OPC-UA)
    const success = await this.opcUaClient.writeCommand(tag, cmd, extraData)

    // Báo cáo kết quả lên Cloud Server
    this.localServerClient.emitPlcResultCommand({
      cmd,
      tag,
      status: success ? NSDevice.ECmdStatus.SUCCESS : NSDevice.ECmdStatus.FAILED,
      message: success ? 'Thực thi thành công' : 'Ghi OPC-UA thất bại',
    })
  }
}
