import { DatabaseModule } from '@database';
import { Module } from '@nestjs/common';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';

@Module({
    imports: [DatabaseModule],
    controllers: [ProductosController],
    providers: [ProductosService]
})
export class ProductosModule {}