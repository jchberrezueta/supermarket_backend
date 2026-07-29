import 'dotenv/config';

import { setDefaultResultOrder } from 'node:dns';

/*
 * Algunas redes resuelven Gmail primero
 * mediante IPv6, aunque no tengan salida
 * IPv6 funcional.
 */
setDefaultResultOrder('ipv4first');

import { ValidationPipe } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import { NestFactory } from '@nestjs/core';

import * as fs from 'fs';

import { AppModule } from './app.module';

async function bootstrap() {
  const useHttps = process.env.HTTPS === 'true';

  const httpsOptions = useHttps
    ? {
        key: fs.readFileSync(
          process.env.HTTPS_KEY_PATH || './certs/localhost+2-key.pem',
        ),

        cert: fs.readFileSync(
          process.env.HTTPS_CERT_PATH || './certs/localhost+2.pem',
        ),
      }
    : undefined;

  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'warn', 'error', 'debug'],

    ...(httpsOptions
      ? {
          httpsOptions,
        }
      : {}),
  });

  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.setGlobalPrefix(configService.get<string>('APP_API_PREFIX') || 'api');

  const corsOrigins = (
    configService.get<string>('CORS_ORIGINS') ||
    [
      'http://localhost:4200',
      'https://localhost:4200',
      'http://localhost',
      'capacitor://localhost',
      'ionic://localhost',
      'https://192.168.50.20',
    ].join(',')
  )
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      /*
       * Postman, curl y aplicaciones
       * móviles nativas pueden no
       * enviar el encabezado Origin.
       */
      if (!origin || corsOrigins.includes(origin)) {
        callback(null, true);

        return;
      }

      callback(new Error('Origen no permitido por CORS'), false);
    },

    credentials: true,

    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const port = Number(configService.get<string>('APP_PORT')) || 3001;

  await app.listen(port, '0.0.0.0');

  console.log(`Backend levantado en ${await app.getUrl()}`);
}

void bootstrap();
