import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { NSDevice } from '~/common/enums'

export class SendCmdReq {
  @ApiProperty({ enum: NSDevice.ECmd, description: 'Lệnh điều khiển gửi xuống Local PC' })
  @IsEnum(NSDevice.ECmd)
  cmd: NSDevice.ECmd

  @ApiProperty({ description: 'Tag thiết bị (OPC-UA NodeID)', example: 'ns=1;s=GateIn.Barrier.Status' })
  @IsString()
  @IsNotEmpty()
  tag: string

  @ApiPropertyOptional({ description: 'Dữ liệu kèm theo lệnh' })
  @IsOptional()
  payload?: Record<string, unknown>
}
