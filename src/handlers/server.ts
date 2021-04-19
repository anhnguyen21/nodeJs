import { APIGatewayProxyHandler, Context, APIGatewayEvent } from 'aws-lambda'
import { Server } from 'http'
import * as express from 'express'
import { ExpressAdapter } from '@nestjs/platform-express'
import { NestFactory } from '@nestjs/core'
import { AppModule } from '../main/app.module'
import { eventContext } from 'aws-serverless-express/middleware'
import { createServer, proxy } from 'aws-serverless-express'
import { setupSwagger } from '../shared/swagger'
import { Database } from '../db/database'

const binaryMimeTypes: string[] = []
let cachedServer: Server

const bootstrapServer = async () => {
  if (!cachedServer) {
    try {
      const expressApp = express()
      const adapter = new ExpressAdapter(expressApp)
      // thực hiện các nhiệm vụ express có trong Adapter thực hiện theo đúng khuôn mẫu

      const nestApp = await NestFactory.create(AppModule, adapter)
      // Chuyển các dữ liệu của các dữ liệu lấy về từ các phương thức chuyển AppModule cấp quyền cho nó
      nestApp.use(eventContext())
      setupSwagger(nestApp)
      //set up swagger in api
      await nestApp.init()
      nestApp.enableCors()
      //cho phép các phương thức làm trong dự án
      cachedServer = createServer(expressApp, undefined, binaryMimeTypes)
      //đóng gói và lưu trữ

      const connectionDb = new Database()
      const connection = await connectionDb.getConnection()
      //gọi function connect database
      await connection.runMigrations({ transaction: 'all' })
      //sử dụng duy nhất 1 lần
    } catch (error) {
      return Promise.reject(error)
    }
  }
  return cachedServer
}

export const handler: APIGatewayProxyHandler = async (event: APIGatewayEvent, context: Context) => {
  event.path === '/documentation' ? (event.path = '/documentation/') : event.path
  event.path = event.path.includes('swagger-ui') ? `/documentation${event.path}` : event.path
  cachedServer = await bootstrapServer()

  return proxy(cachedServer, event, context, 'PROMISE').promise
}
