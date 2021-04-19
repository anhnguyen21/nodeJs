import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { configService } from '../config/config.service'

export function setupSwagger(app: INestApplication) {
  if (!configService.isProduction()) {
    const document = SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('On the Rise API')
        .setDescription('On the Rise API')
        .setVersion('1.0')
        .addServer(configService.isProduction() ? '/' : `/${configService.getMode()}/`)
        .build()
    )
    SwaggerModule.setup('/documentation', app, document)
  }
}
