import { Module } from '@nestjs/common';
import { CategoriasModule } from './categorias/categorias.module';
import { MarcasModule } from './marcas/marcas.module';
import { ProductitosModule } from './productos/productos.module';

@Module({
    imports: [
        CategoriasModule,
        MarcasModule,
        ProductitosModule
    ]
})
export class ProductosModule {}