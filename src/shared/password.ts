import * as bcryptjs from 'bcryptjs'
import { config } from '../config'

export class PasswordUtil {
  static generateHash(password: string): string {
    return bcryptjs.hashSync(password, config.bcrypt.salt)
  }
  static validateHash(password: string, hash: string): boolean {
    return bcryptjs.compareSync(password, hash)
  }
}
