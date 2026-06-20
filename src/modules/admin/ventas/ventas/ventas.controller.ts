import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/modules/auth/roles.decorator';
import { RolesGuard } from 'src/modules/auth/roles.guard';
import { CreateVentaDTO } from './dto/create_venta.dto';
import { FilterVentaDTO } from './dto/filter_venta.dto';
import { UpdateVentaDTO } from './dto/update_venta.dto';
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

  @Post('insertar')
  async insertar(@Body() body: CreateVentaDTO) {
    return this.ventasService.insertar(body);
  }

  @Put('actualizar/:id')
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateVentaDTO,
  ) {
    body.cabeceraVenta.ideVent = id;

    return this.ventasService.actualizar(body);
  }

  @Delete('eliminar/:id')
  async eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.ventasService.eliminar(id);
  }

  @Get('detalles/:id')
  async buscarDetallesVenta(@Param('id', ParseIntPipe) id: number) {
    return this.ventasService.buscarDetallesVenta(id);
  }
}
