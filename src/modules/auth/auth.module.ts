import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  CuentaMfaEntity,
  PasswordResetTokenEntity,
  RefreshTokenEntity,
} from '@entities';

import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';

import { CuentasModule } from '../admin/seguridad/cuentas/cuentas.module';
import { accesosModule } from '../admin/seguridad/accesos/accesos.module';
import { RefreshTokenRepository } from './refresh_token/refresh_token.repository';
import { RefreshTokenService } from './refresh_token/refresh_token.service';
import { PasswordResetTokenRepository } from './password_reset_token/password_reset_token.repository';
import { PasswordResetTokenService } from './password_reset_token/password_reset_token.service';
import { PasswordPolicyService } from './password_policy/password_policy.service';
import { HistorialClaveEntity } from '../../database/entities/historial_clave.entity';
import { HistorialClaveService } from './historial_clave/historial_clave.service';
import { HistorialClaveRepository } from './historial_clave/historial_clave.repository';
import { CuentaMfaRepository } from './cuenta_mfa/cuenta_mfa.repository';
import { CuentaMfaService } from './cuenta_mfa/cuenta_mfa.service';
import { EmailModule } from './email/email.module';
import { GeolocationService } from './services/geolocation.service';
import { MfaCryptoService } from './cuenta_mfa/cuenta_mfa_crypto.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RefreshTokenEntity,
      PasswordResetTokenEntity,
      HistorialClaveEntity,
      CuentaMfaEntity,
    ]),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const jwtSecret = configService.get<string>('JWT_SECRET');

        if (!jwtSecret) {
          throw new Error('JWT_SECRET es obligatorio');
        }

        return {
          secret: jwtSecret,
          signOptions: {
            expiresIn: '15m',
          },
        };
      },
    }),

    PassportModule,
    CuentasModule,
    accesosModule,
    EmailModule,
  ],

  providers: [
    AuthService,
    JwtStrategy,
    RefreshTokenRepository,
    RefreshTokenService,
    PasswordResetTokenRepository,
    PasswordResetTokenService,
    PasswordPolicyService,
    HistorialClaveRepository,
    HistorialClaveService,
    CuentaMfaRepository,
    CuentaMfaService,
    MfaCryptoService,
    GeolocationService,
  ],

  controllers: [AuthController],

  exports: [AuthService, JwtModule],
})
export class AuthModule {}
