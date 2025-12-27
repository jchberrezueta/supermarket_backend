import { Controller, Get, Param, Query } from '@nestjs/common';
import { MobileProductosService } from './productos.service';

/**
 * Controller público para productos en la tienda móvil
 * NO requiere autenticación - endpoints públicos
 */
@Controller('mobile/productos')
export class MobileProductosController {

    constructor(private readonly productosService: MobileProductosService) {}

    /**
     * Filtrar productos
     * GET /mobile/productos/filtrar?ideCate=1&nombreProd=leche
     * IMPORTANTE: Esta ruta debe ir ANTES de :id para evitar conflictos
     */
    @Get('filtrar')
    async filtrar(
        @Query('ideCate') ideCate?: string,
        @Query('ideMarc') ideMarc?: string,
        @Query('codigoBarraProd') codigoBarraProd?: string,
        @Query('nombreProd') nombreProd?: string,
        @Query('disponibleProd') disponibleProd?: string,
        @Query('estadoProd') estadoProd?: string
    ) {
        return this.productosService.filtrar({
            ideCate: ideCate ? +ideCate : undefined,
            ideMarc: ideMarc ? +ideMarc : undefined,
            codigoBarraProd,
            nombreProd,
            disponibleProd,
            estadoProd
        });
    }

    /**
     * Listar todos los productos
     * GET /mobile/productos
     */
    @Get()
    async listar() {
        return this.productosService.listar();
    }

    /**
     * Buscar producto por ID
     * GET /mobile/productos/:id
     */
    @Get(':id')
    async buscar(@Param('id') id: number) {
        return this.productosService.buscar(id);
    }
}
