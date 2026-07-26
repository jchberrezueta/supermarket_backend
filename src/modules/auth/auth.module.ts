import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PasswordResetTokenEntity, RefreshTokenEntity } from '@entities';

import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';

import { CuentasModule } from '../admin/seguridad/cuentas/cuentas.module';
import { accesosModule } from '../admin/seguridad/accesos/accesos.module';
import { RefreshTokenRepository } from './refresh_token.repository';
import { RefreshTokenService } from './refresh_token.service';
import { PasswordResetTokenRepository } from './password_reset_token.repository';
import { PasswordResetTokenService } from './password_reset_token.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshTokenEntity, PasswordResetTokenEntity]),

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
  ],

  controllers: [AuthController],

  exports: [AuthService, JwtModule],
})
export class AuthModule {}
