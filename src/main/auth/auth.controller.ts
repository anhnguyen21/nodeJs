import { Controller, Post, Body, HttpCode, UsePipes, ValidationPipe, HttpException } from '@nestjs/common'
import { ApiOkResponse, ApiTags, ApiBadRequestResponse } from '@nestjs/swagger'
import { RegisterAndLoginResponse } from './interface'
import { ForgotPasswordDto, ForgotPasswordResponse, LoginDto, RegisterDto, ResetPasswordDto } from './dto'
import { AuthService } from './auth.service'

@Controller('auth')
//tên đuôi của controller
@ApiTags('auth')
//đính kèm tên controller
@UsePipes(ValidationPipe)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @HttpCode(200)
  //định nghĩa cái được phản hồi
  //định dạng kiểu dữ liệu trả về
  @ApiOkResponse({
    type: RegisterAndLoginResponse,
    description: 'Register an account successful'
  })
  //RegisterDto mặc định báo kiểu dữ liệu nhập vào Promise cho phép thực hiện tất cả
  //the same validate
  register(@Body() payload: RegisterDto): Promise<any> {
    return this.authService.register(payload)
  }

  @Post('/login')
  @HttpCode(200)
  @ApiOkResponse({
    type: RegisterAndLoginResponse,
    description: 'Login successful'
  })
  @HttpCode(400)
  @ApiBadRequestResponse({
    description: 'invalidate values'
  })
  login(@Body() payload: LoginDto): Promise<any> {
    return this.authService.login(payload)
  }

  @Post('/forgotPassword')
  @HttpCode(200)
  @ApiOkResponse({
    type: ForgotPasswordResponse,
    description: 'Forgot your password'
  })
  forgotPassword(@Body() payload: ForgotPasswordDto): Promise<any> {
    return this.authService.forgotPassword(payload)
  }

  @Post('/resetPassword')
  @HttpCode(200)
  @ApiOkResponse({
    type: ForgotPasswordResponse,
    description: 'Reset your password'
  })
  resetPassword(@Body() payload: ResetPasswordDto): Promise<any> {
    return this.authService.resetPassword(payload)
  }
}
