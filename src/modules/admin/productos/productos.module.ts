import { Module } from '@nestjs/common';
import { CategoriasModule } from './categorias/categorias.module';
import { MarcasModule } from './marcas/marcas.module';

@Module({
    imports: [
        CategoriasModule,
        MarcasModule,
        ProductosModule
    ]
})
export class ProductosModule {}