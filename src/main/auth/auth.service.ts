import { Injectable, NotFoundException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common'
import { ForgotPasswordDto, LoginDto, RegisterDto, ResetPasswordDto } from './dto'
import { AppUser } from '../../entities/User'
import { PasswordUtil } from '../../shared/password'
import { JwtService } from '@nestjs/jwt'
import * as _ from 'lodash'
import { nanoid } from 'nanoid'
import { ROLE_NAME } from '../../common/constant'
import { AppRole } from '../../entities/Role'
import { getManager } from 'typeorm'
import { dateUtils } from '../../providers/datetimeUtils'
import { config } from '../../config'
import { sendEmailResetPassword } from '../../emailService'

const userPickFields = ['id', 'email', 'userName', 'firstName', 'lastName', 'avatar', 'isEnabled', 'roles']

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async register(payload: RegisterDto): Promise<any> {
    payload.email = payload.email.toLowerCase()
    const { email, password } = payload
    delete payload.password
    const passwordHash = PasswordUtil.generateHash(password)

    const user = await AppUser.findOne({ where: { email } })
    if (user) {
      throw new NotFoundException('The email is existing.')
    }

    //default to create user with role user
    const userRole = await AppRole.findOne({ where: { name: ROLE_NAME.NormalUser } })
    if (!userRole) {
      throw new InternalServerErrorException('The user role was not found.')
    }
    return await getManager().transaction(async (transaction) => {
      //truyền dữ liệu theo class AppUser change type phù hợp
      const insertedUser = AppUser.create({ ...payload, password: passwordHash, roles: [userRole] })
      //dùng transaction để lưu dữ liệu
      await transaction
        .getRepository(AppUser)
        .save(insertedUser)
        .catch((err) => {
          //tìm tại vị trí chỉ mục cần bắt lối ở đây có user name và email không được trung nhau
          if (err.message.indexOf('uq_app_user_user_name') > -1) {
            throw new InternalServerErrorException(`User name ${payload.userName} is already existed.`)
          }
          if (err.message.indexOf('uq_app_user_email') > -1) {
            throw new InternalServerErrorException(`Email ${payload.email} is already existed.`)
          }
          throw new InternalServerErrorException(`Error when creating new user: ${err}`)
        })

      const jwtData = {
        //pick trong lodash lấy dữ liệu các trường được khai báo ở trên với entities
        ..._.pick(insertedUser, userPickFields),
        scope: insertedUser.roles.map((s) => s.name)?.join(',')
      }
      const { accessToken, refreshToken } = this.createTokenAndRefreshToken(jwtData)

      return {
        user: jwtData,
        accessToken,
        refreshToken
      }
    })
  }

  async forgotPassword(payload: ForgotPasswordDto): Promise<any> {
    const user = await AppUser.createQueryBuilder()
      .innerJoinAndSelect('AppUser.roles', 'role')
      .where('AppUser.email = :email', { email: payload.email.toLowerCase() })
      .getOne()

    if (user) {
      user.resetPasswordToken = nanoid(128)
      user.resetPasswordTokenExpired = dateUtils.nextOneDay

      await AppUser.save(user)
      const linkResetPassword = `${config.api.clientWebsite}/reset-password?token=${user.resetPasswordToken}`
      await sendEmailResetPassword(user.email, linkResetPassword)
    }
    return { message: 'Your reset password request has been confirmed' }
  }

  async resetPassword(payload: ResetPasswordDto): Promise<any> {
    const { resetPasswordToken, newPassword } = payload
    const user = await AppUser.createQueryBuilder()
      .where('AppUser.resetPasswordToken = :resetPasswordToken', {
        resetPasswordToken: resetPasswordToken
      })
      .andWhere('AppUser.resetPasswordTokenExpired >= :resetPasswordTokenExpired', {
        resetPasswordTokenExpired: dateUtils.nowDay.toISOString()
      })
      .getOne()

    if (!user) {
      throw new UnauthorizedException('The token incorrect or expired')
    }

    user.password = PasswordUtil.generateHash(newPassword)
    user.resetPasswordToken = null
    user.resetPasswordTokenExpired = null

    await AppUser.save(user)
    return { message: 'Your password has been reset' }
  }

  async login(payload: LoginDto): Promise<any> {
    payload.email = payload.email.toLowerCase()
    const { email, password } = payload
    const user = await AppUser.createQueryBuilder()
      .innerJoinAndSelect('AppUser.roles', 'role')
      .where('AppUser.email = :email', { email })
      .orWhere('AppUser.userName = :username', { username: email })
      .addSelect('AppUser.password')
      .getOne()
    if (!user) {
      throw new NotFoundException('The email or password incorrect')
    }
    const isPasswordCorrect = PasswordUtil.validateHash(password, user.password)
    if (!isPasswordCorrect) {
      throw new NotFoundException('The email or password incorrect')
    }
    const jwtData = {
      ..._.pick(user, userPickFields),
      scope: user.roles.map((s) => s.name)?.join(',')
    }
    const { accessToken, refreshToken } = this.createTokenAndRefreshToken(jwtData)
    return {
      user: jwtData,
      accessToken,
      refreshToken
    }
  }

  createTokenAndRefreshToken(payload: any) {
    //đăng kí token
    const accessToken = this.jwtService.sign(payload)
    // set giá tri của dữ liệu la 128 kí tự giống xác định giá trị duy nhất
    const refreshToken = nanoid(128)
    return {
      accessToken,
      refreshToken
    }
  }
}
