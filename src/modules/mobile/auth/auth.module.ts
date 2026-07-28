import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClienteEntity, CuentaClienteEntity } from '@entities';
import { MobileAuthController } from './auth.controller';
import { MobileAuthService } from './auth.service';
import { MobileJwtStrategy } from './mobile-jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClienteEntity, CuentaClienteEntity]),

    PassportModule.register({
      defaultStrategy: 'jwt-mobile',
    }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('MOBILE_JWT_SECRET')?.trim();

        if (!secret) {
          throw new Error('MOBILE_JWT_SECRET es obligatorio');
        }

        return {
          secret,
          signOptions: {
            expiresIn:
              configService.get<string>('MOBILE_JWT_EXPIRES_IN') || '8h',
          },
        };
      },
    }),
  ],

  controllers: [MobileAuthController],

  providers: [MobileAuthService, MobileJwtStrategy],

  exports: [MobileAuthService, JwtModule],
})
export class ClienteAuthModule {}
