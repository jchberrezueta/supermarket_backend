import { Module } from '@nestjs/common';
import { DatabaseModule } from '@database';
import { ProveedoresService } from './proveedores.service';
import { ProveedoresController } from './proveedores.controller';

@Module({
    imports: [DatabaseModule],
    controllers: [ProveedoresController],
    providers: [ProveedoresService]
})
export class ProveedoresModule {}