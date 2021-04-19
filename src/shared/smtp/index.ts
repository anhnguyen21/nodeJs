import * as nodemailer from 'nodemailer'
import { config } from '../../config'

export const transporter = nodemailer.createTransport({
  host: config.smtpService.host,
  port: config.smtpService.port,
  secure: true,
  auth: {
    user: config.smtpService.user,
    pass: config.smtpService.password
  }
})
