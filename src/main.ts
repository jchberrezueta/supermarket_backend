import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'verbose', 'log'],
  });
  const configService = app.get(ConfigService);
  app.enableCors();
  app.setGlobalPrefix(configService.get<string>('APP_API_PREFIX'));


  await app.listen(configService.get<number>('APP_PORT') || 3000);
  console.log(`El backend esta levantado y escuchando en el puerto ${await app.getUrl()} :)`)
}
bootstrap();