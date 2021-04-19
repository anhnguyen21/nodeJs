import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
require('dotenv').config()

export class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  public getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key]
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`)
    }

    return value
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true))
    return this
  }

  public getMode() {
    return this.getValue('NODE_ENV', true)
  }

  public isProduction() {
    const mode = this.getValue('NODE_ENV', false)
    return mode && mode != 'dev'
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',

      host: this.getValue('POSTGRES_HOST'),
      username: this.getValue('POSTGRES_USER'),
      password: this.getValue('POSTGRES_PASSWORD'),
      database: this.getValue('POSTGRES_DATABASE'),
      migrationsTableName: 'migration',
      logging: 'all',

      cli: {
        migrationsDir: 'src/db/migrations',
        entitiesDir: 'src/entities'
      },
      namingStrategy: new SnakeNamingStrategy(),
      ssl: this.isProduction()
    }
  }
}

const configService = new ConfigService(process.env).ensureValues([
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_DATABASE'
])

export { configService }
