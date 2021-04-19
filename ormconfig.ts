import { ConfigService } from './src/config/config.service'

import { TypeOrmModuleOptions } from '@nestjs/typeorm'
const typeOrmConfig: TypeOrmModuleOptions = {
  ...new ConfigService(process.env).getTypeOrmConfig(),
  entities: [__dirname + '/src/entities/*{.ts,.js}'],
  subscribers: [__dirname + '/src/entities/*{.ts,.js}'],
  migrations: [__dirname + '/src/db/migrations/*{.ts,.js}']
}

module.exports = typeOrmConfig
