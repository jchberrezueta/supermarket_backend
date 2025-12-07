import { DatabaseModule } from '@database';
import { Module } from '@nestjs/common';
import { CategoriasController } from './categorias.controller';
import { CategoriasService } from './categorias.service';

@Module({
    imports: [DatabaseModule],
    controllers: [CategoriasController],
    providers: [CategoriasService]
})
export class CategoriasModule {}