import { Module } from '@nestjs/common';
import { ClienteAuthController } from './auth.controller';
import { ClienteAuthService } from './auth.service';
import { DatabaseModule } from '@database';
import { AuthModule } from '../../auth/auth.module';

@Module({
    imports: [
        DatabaseModule,
        AuthModule
    ],
    controllers: [ClienteAuthController],
    providers: [ClienteAuthService],
    exports: [ClienteAuthService]
})
export class ClienteAuthModule {}
