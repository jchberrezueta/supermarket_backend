import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

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
import { RefreshTokenRepository } from './refresh_token.repository';
import { RefreshTokenService } from './refresh_token.service';
import { PasswordResetTokenRepository } from './password_reset_token.repository';
import { PasswordResetTokenService } from './password_reset_token.service';
import { PasswordPolicyService } from './password_policy.service';
import { HistorialClaveEntity } from '../../database/entities/historial_clave.entity';
import { HistorialClaveService } from './historial_clave.service';
import { HistorialClaveRepository } from './historial_clave.repository';
import { CuentaMfaRepository } from './cuenta_mfa.repository';
import { CuentaMfaService } from './cuenta_mfa.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RefreshTokenEntity,
      PasswordResetTokenEntity,
      HistorialClaveEntity,
      CuentaMfaEntity,
    ]),

    JwtModule.register({
      secret: process.env.JWT_SECRET || 'haki',
      signOptions: { expiresIn: '1h' },
    }),

    PassportModule,
    CuentasModule,
    accesosModule,
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
  ],

  controllers: [AuthController],

  exports: [AuthService, JwtModule],
})
export class AuthModule {}
