import { Module } from '@nestjs/common';
import { MobileCategoriasController } from './categorias.controller';
import { MobileCategoriasService } from './categorias.service';
import { DatabaseModule } from '@database';

@Module({
    imports: [DatabaseModule],
    controllers: [MobileCategoriasController],
    providers: [MobileCategoriasService],
    exports: [MobileCategoriasService]
})
export class MobileCategoriasModule {}
