import { ApiProperty } from '@nestjs/swagger'

export class StringResponse {
  @ApiProperty()
  message: string
}
