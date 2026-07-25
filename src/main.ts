import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';

async function bootstrap() {
  // Crear una instancia temporal para leer configuración
  const configService = new ConfigService();

  const useHttps = configService.get<string>('HTTPS') === 'true';

  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'warn', 'error', 'debug'],
    ...(useHttps && {
      httpsOptions: {
        key: fs.readFileSync(
          configService.get<string>('HTTPS_KEY_PATH') ||
            './certs/localhost+2-key.pem',
        ),
        cert: fs.readFileSync(
          configService.get<string>('HTTPS_CERT_PATH') ||
            './certs/localhost+2.pem',
        ),
      },
    }),
  });

  const appConfig = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.setGlobalPrefix(appConfig.get<string>('APP_API_PREFIX'));

  app.enableCors();

  await app.listen(appConfig.get<number>('APP_PORT') || 3000, '0.0.0.0');

  console.log(
    `-----> El backend esta levantado en ${await app.getUrl()} :) <-----`,
  );
}

bootstrap();
