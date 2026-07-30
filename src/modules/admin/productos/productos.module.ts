import { Module } from '@nestjs/common';
import { CategoriasModule } from './categorias/categorias.module';
import { MarcasModule } from './marcas/marcas.module';
import { ProductitosModule } from './productos/productos.module';
import { LotesModule } from './lotes/lotes.module';
import { MovimientosInventarioModule } from './movimientos/movimientos.module';

@Module({
  imports: [
    CategoriasModule,
    MarcasModule,
    ProductitosModule,
    LotesModule,
    MovimientosInventarioModule,
  ],
})
export class ProductosModule {}
