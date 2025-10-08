import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { CuentasModule } from '../admin/seguridad/cuentas/cuentas.module';
import { accesosModule } from '../admin/seguridad/accesos/accesos.module'

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'haki',
            signOptions: { expiresIn: '1h' },
        }),
        PassportModule,
        CuentasModule,
        accesosModule,
    ],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule {}
