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
import {
  PermissionGuard,
  RequirePermission,
} from 'src/modules/auth/authorization';
import { AnularEntregaDTO } from './dto/anular_entrega.dto';
import { CreateEntregaDTO } from './dto/create_entrega.dto';
import { FilterEntregaDTO } from './dto/filter_entrega.dto';
import { UpdateEntregaDTO } from './dto/update_entrega.dto';
import { EntregasService } from './entregas.service';

const RUTA_ENTREGAS = '/admin/bodega/entregas';

@UseGuards(AuthGuard('jwt'), PermissionGuard)
@Controller('entregas')
export class EntregasController {
  constructor(private readonly entregasService: EntregasService) {}

  @RequirePermission(RUTA_ENTREGAS, 'listar')
  @Get()
  async listar() {
    return this.entregasService.listar();
  }

  @RequirePermission(RUTA_ENTREGAS, 'listar')
  @Get('buscar/:id')
  async buscar(@Param('id', ParseIntPipe) id: number) {
    return this.entregasService.buscar(id);
  }

  @RequirePermission(RUTA_ENTREGAS, 'listar')
  @Get('filtrar')
  async filtrar(@Query() queryParams: FilterEntregaDTO) {
    return this.entregasService.filtrar(queryParams);
  }

  @RequirePermission(RUTA_ENTREGAS, 'insertar')
  @Post('insertar')
  async insertar(@Body() body: CreateEntregaDTO) {
    return this.entregasService.insertar(body);
  }

  @RequirePermission(RUTA_ENTREGAS, 'modificar')
  @Put('actualizar/:id')
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateEntregaDTO,
  ) {
    return this.entregasService.actualizar(id, body);
  }

  @RequirePermission(RUTA_ENTREGAS, 'listar')
  @Get('pedidos/disponibles')
  async listarPedidosDisponibles() {
    return this.entregasService.listarPedidosDisponibles();
  }

  @RequirePermission(RUTA_ENTREGAS, 'listar')
  @Get('pedidos/:id/pendientes')
  async obtenerPedidoPendiente(@Param('id', ParseIntPipe) id: number) {
    return this.entregasService.obtenerPedidoPendiente(id);
  }

  @RequirePermission(RUTA_ENTREGAS, 'listar')
  @Get('proveedores/empresa/:id')
  async listarProveedoresEmpresa(@Param('id', ParseIntPipe) id: number) {
    return this.entregasService.listarProveedoresEmpresa(id);
  }

  @RequirePermission(RUTA_ENTREGAS, 'modificar')
  @Put('confirmar/:id')
  async confirmar(@Param('id', ParseIntPipe) id: number) {
    return this.entregasService.confirmar(id);
  }

  @RequirePermission(RUTA_ENTREGAS, 'modificar')
  @Put('anular/:id')
  async anular(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: AnularEntregaDTO,
  ) {
    return this.entregasService.anular(id, body);
  }

  @RequirePermission(RUTA_ENTREGAS, 'eliminar')
  @Delete('eliminar/:id')
  async eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.entregasService.eliminar(id);
  }

  /**
   * JOINS
   */
  @RequirePermission(RUTA_ENTREGAS, 'listar')
  @Get('listar/entregas')
  async listarEntregas() {
    return this.entregasService.listarEntregas();
  }

  @RequirePermission(RUTA_ENTREGAS, 'listar')
  @Get('filtrar/pedidos')
  async filtrarEntregas(@Query() queryParams: FilterEntregaDTO) {
    return this.entregasService.filtrarEntregas(queryParams);
  }

  @RequirePermission(RUTA_ENTREGAS, 'listar')
  @Get('listar/detalles/:id')
  async listarDetallesEntrega(@Param('id', ParseIntPipe) id: number) {
    return this.entregasService.listarDetallesEntrega(id);
  }

  /**
   * COMBOS
   */
  @RequirePermission(RUTA_ENTREGAS, 'listar')
  @Get('listar/combo/estados')
  async listarComboEstados() {
    return this.entregasService.listarComboEstados();
  }
}
