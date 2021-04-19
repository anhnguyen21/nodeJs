import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator'
import { StringResponse } from './common'

export class RegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  userName: string

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(32)
  password: string
}

export class LoginDto {
  @ApiProperty()
  @IsNotEmpty()
  email: string

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @MaxLength(32)
  @IsNotEmpty()
  password: string
}

export class ForgotPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email: string
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(32)
  newPassword: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  resetPasswordToken: string
}

export class ForgotPasswordResponse extends StringResponse {}
