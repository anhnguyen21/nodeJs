import { ApiProperty } from '@nestjs/swagger'

export class RegisterAndLoginResponse {
  //định nghĩa giá trị mặc định khi trả về
  @ApiProperty()
  user: string

  @ApiProperty()
  accessToken: string

  @ApiProperty()
  refreshToken: string
}
