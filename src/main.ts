import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'verbose', 'log'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true
    })
  );
  const configService = app.get(ConfigService);
  app.enableCors();
  app.setGlobalPrefix(configService.get<string>('APP_API_PREFIX'));


  await app.listen(configService.get<number>('APP_PORT') || 3000);
  console.log(`El backend esta levantado y escuchando en el puerto ${await app.getUrl()} :)`)
}
bootstrap();