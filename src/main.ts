import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { DatabaseExceptionFilter } from './common/filters/database-exception.filter';
import * as express from 'express';
async function bootstrap() {
  // Necesitamos conservar el body original de la petición
  // para poder verificar la firma del webhook.
  const app = await NestFactory.create(AppModule, { rawBody: true });
  const logger = new Logger('Bootstrap');

  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new DatabaseExceptionFilter());
  const config = new DocumentBuilder()
    .setTitle('App Technology Store')
    .setDescription('Devices store endponts')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(process.env.PORT);
  logger.log(`App running on Port ${process.env.PORT} 🧑‍💻`);
}
bootstrap();
