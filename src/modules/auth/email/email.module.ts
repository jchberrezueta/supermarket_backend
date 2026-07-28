import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './email.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('MAIL_HOST')?.trim();

        const user = configService.get<string>('MAIL_USER')?.trim();

        const password = configService.get<string>('MAIL_PASSWORD');

        if (!host || !user || !password) {
          throw new Error('La configuración de correo está incompleta');
        }

        return {
          transport: {
            host,
            port: Number(configService.get<string>('MAIL_PORT') || 587),
            secure: configService.get<string>('MAIL_SECURE') === 'true',
            auth: {
              user,
              pass: password,
            },
          },
        };
      },
    }),
  ],

  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
