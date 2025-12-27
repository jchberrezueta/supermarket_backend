import { Module } from '@nestjs/common';
import { MobileClientesController } from './clientes.controller';
import { MobileClientesService } from './clientes.service';
import { DatabaseModule } from '@database';

@Module({
    imports: [DatabaseModule],
    controllers: [MobileClientesController],
    providers: [MobileClientesService],
    exports: [MobileClientesService]
})
export class MobileClientesModule {}
