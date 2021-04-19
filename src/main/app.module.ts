import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module'
import * as typeOrmConfig from '../../ormconfig'

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), AuthModule]
  //set định dạng dữ liệu kết nối database
})
export class AppModule {}
