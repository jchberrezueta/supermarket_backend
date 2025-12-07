import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {logger: ['log', 'warn', 'error', 'debug']});
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true
    })
  );
  app.setGlobalPrefix(configService.get<string>('APP_API_PREFIX'));
  app.enableCors();

  await app.listen(configService.get<number>('APP_PORT') || 3000);
  console.log(`-----> El backend esta levantado y escuchando en el puerto ${await app.getUrl()} :) <-----`);
}
bootstrap();