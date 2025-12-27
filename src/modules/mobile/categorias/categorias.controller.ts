import { Controller, Get, Param } from '@nestjs/common';
import { MobileCategoriasService } from './categorias.service';

/**
 * Controller público para categorías en la tienda móvil
 * NO requiere autenticación - endpoints públicos
 */
@Controller('mobile/categorias')
export class MobileCategoriasController {

    constructor(private readonly categoriasService: MobileCategoriasService) {}

    /**
     * Listar todas las categorías
     * GET /mobile/categorias
     */
    @Get()
    async listar() {
        return this.categoriasService.listar();
    }

    /**
     * Buscar categoría por ID
     * GET /mobile/categorias/:id
     */
    @Get(':id')
    async buscar(@Param('id') id: number) {
        return this.categoriasService.buscar(id);
    }
}
