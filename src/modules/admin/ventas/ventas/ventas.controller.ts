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
import { Roles } from 'src/modules/auth/authorization/roles/roles.decorator';
import { RolesGuard } from 'src/modules/auth/authorization/roles/roles.guard';
import { CancelarVentaDTO } from './dto/cancelar_venta.dto';
import { FilterVentaDTO } from './dto/filter_venta.dto';
import { VentasService } from './ventas.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('padmin', 'pventas')
@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Get()
  async listar() {
    return this.ventasService.listar();
  }

  @Get('buscar/:id')
  async buscar(@Param('id', ParseIntPipe) id: number) {
    return this.ventasService.buscar(id);
  }

  @Get('filtrar')
  async filtrar(@Query() queryParams: FilterVentaDTO) {
    return this.ventasService.filtrar(queryParams);
  }

  @Get('detalles/:id')
  async buscarDetallesVenta(@Param('id', ParseIntPipe) id: number) {
    return this.ventasService.buscarDetallesVenta(id);
  }

  @Get('trazabilidad/:id')
  async buscarTrazabilidadVenta(@Param('id', ParseIntPipe) id: number) {
    return this.ventasService.buscarTrazabilidadVenta(id);
  }

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
