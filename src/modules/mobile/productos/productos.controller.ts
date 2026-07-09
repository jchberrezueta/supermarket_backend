import { Controller, Get, Param, Query } from '@nestjs/common';
import { IdUtil } from '@common/index';
import { MobileProductosService } from './productos.service';

/**
 * Controller público para productos en la tienda móvil.
 *
 * No requiere autenticación porque representa el catálogo público.
 */
@Controller('mobile/productos')
export class MobileProductosController {
  constructor(private readonly productosService: MobileProductosService) {}

  /**
   * Filtrar productos.
   *
   * GET /mobile/productos/filtrar?ideCate=0&nombreProd=leche
   *
   * Importante:
   * Esta ruta debe ir antes de :id para evitar conflictos.
   */
  @Get('filtrar')
  async filtrar(
    @Query('ideCate') ideCate?: string,
    @Query('ideMarc') ideMarc?: string,
    @Query('codigoBarraProd') codigoBarraProd?: string,
    @Query('nombreProd') nombreProd?: string,
    @Query('disponibleProd') disponibleProd?: string,
    @Query('estadoProd') estadoProd?: string,
  ) {
    return this.productosService.filtrar({
      ideCate: this.parseOptionalId(ideCate),
      ideMarc: this.parseOptionalId(ideMarc),
      codigoBarraProd,
      nombreProd,
      disponibleProd,
      estadoProd,
    });
  }

  /**
   * Listar todos los productos.
   *
   * GET /mobile/productos
   */
  @Get()
  async listar() {
    return this.productosService.listar();
  }

  /**
   * Buscar producto por ID.
   *
   * GET /mobile/productos/:id
   */
  @Get(':id')
  async buscar(@Param('id') id: string) {
    return this.productosService.buscar(IdUtil.requireId(id));
  }

  private parseOptionalId(value?: string): number | undefined {
    if (value === undefined || value === null || value.trim() === '') {
      return undefined;
    }

    return IdUtil.requireId(value);
  }
}
