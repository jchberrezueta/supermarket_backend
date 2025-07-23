import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { CuentasModule } from '../admin/seguridad/cuentas/cuentas.module';

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'haki', // usa variable de entorno
            signOptions: { expiresIn: '1h' },
        }),
        PassportModule,
        CuentasModule, // módulo que maneja usuarios y roles
    ],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule {}
