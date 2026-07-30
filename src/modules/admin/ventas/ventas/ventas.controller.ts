import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  PermissionGuard,
  RequirePermission,
} from 'src/modules/auth/authorization';
import { CancelarVentaDTO } from './dto/cancelar_venta.dto';
import { FilterVentaDTO } from './dto/filter_venta.dto';
import { VentasService } from './ventas.service';

const RUTA_VENTAS = '/admin/ventas/ventas';

@UseGuards(AuthGuard('jwt'), PermissionGuard)
@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @RequirePermission(RUTA_VENTAS, 'listar')
  @Get()
  async listar() {
    return this.ventasService.listar();
  }

  @RequirePermission(RUTA_VENTAS, 'listar')
  @Get('buscar/:id')
  async buscar(@Param('id', ParseIntPipe) id: number) {
    return this.ventasService.buscar(id);
  }

  @RequirePermission(RUTA_VENTAS, 'listar')
  @Get('filtrar')
  async filtrar(@Query() queryParams: FilterVentaDTO) {
    return this.ventasService.filtrar(queryParams);
  }

  @RequirePermission(RUTA_VENTAS, 'listar')
  @Get('detalles/:id')
  async buscarDetallesVenta(@Param('id', ParseIntPipe) id: number) {
    return this.ventasService.buscarDetallesVenta(id);
  }

  @RequirePermission(RUTA_VENTAS, 'listar')
  @Get('trazabilidad/:id')
  async buscarTrazabilidadVenta(@Param('id', ParseIntPipe) id: number) {
    return this.ventasService.buscarTrazabilidadVenta(id);
  }

  @RequirePermission(RUTA_VENTAS, 'modificar')
  @Put('cancelar/:id')
  async cancelarVenta(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CancelarVentaDTO,
    @Req() req: any,
  ) {
    return this.ventasService.cancelarVenta(
      id,
      body.motivo,
      req.user?.username ?? 'admin',
    );
  }
}
