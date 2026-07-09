import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ClienteEntity, CuentaClienteEntity } from '@entities';
import { MobileAuthController } from './auth.controller';
import { MobileAuthService } from './auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClienteEntity, CuentaClienteEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'haki',
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN || '8h',
      },
    }),
  ],
  controllers: [MobileAuthController],
  providers: [MobileAuthService],
  exports: [MobileAuthService],
})
export class ClienteAuthModule {}
