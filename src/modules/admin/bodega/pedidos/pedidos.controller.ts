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
import { CancelarPedidoDTO } from './dto/cancelar_pedido.dto';
import { CerrarPedidoIncompletoDTO } from './dto/cerrar_pedido_incompleto.dto';
import { CreatePedidoDTO } from './dto/create_pedido.dto';
import { FilterPedidoDTO } from './dto/filter_pedido.dto';
import { UpdatePedidoDTO } from './dto/update_pedido.dto';
import { PedidosService } from './pedidos.service';

const RUTA_PEDIDOS = '/admin/bodega/pedidos';

@UseGuards(AuthGuard('jwt'), PermissionGuard)
@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  // ==========================================================
  // CONSULTAS
  // ==========================================================

  @RequirePermission(RUTA_PEDIDOS, 'listar')
  @Get()
  async listar() {
    return this.pedidosService.listar();
  }

  @RequirePermission(RUTA_PEDIDOS, 'listar')
  @Get('buscar/:id')
  async buscar(@Param('id', ParseIntPipe) id: number) {
    return this.pedidosService.buscar(id);
  }

  @RequirePermission(RUTA_PEDIDOS, 'listar')
  @Get('filtrar')
  async filtrar(@Query() queryParams: FilterPedidoDTO) {
    return this.pedidosService.filtrar(queryParams);
  }

  // ==========================================================
  // BORRADOR
  // ==========================================================

  @RequirePermission(RUTA_PEDIDOS, 'insertar')
  @Post('insertar')
  async insertar(@Body() body: CreatePedidoDTO) {
    return this.pedidosService.insertar(body);
  }

  @RequirePermission(RUTA_PEDIDOS, 'modificar')
  @Put('actualizar/:id')
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePedidoDTO,
  ) {
    body.cabeceraPedido.idePedi = id;

    return this.pedidosService.actualizar(body);
  }

  @RequirePermission(RUTA_PEDIDOS, 'eliminar')
  @Delete('eliminar/:id')
  async eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.pedidosService.eliminar(id);
  }

  // ==========================================================
  // CICLO FORMAL DEL PEDIDO
  // ==========================================================

  /**
   * Convierte un pedido borrador en emitido.
   *
   * PUT /pedidos/emitir/:id
   */
  @RequirePermission(RUTA_PEDIDOS, 'modificar')
  @Put('emitir/:id')
  async emitir(@Param('id', ParseIntPipe) id: number) {
    return this.pedidosService.emitir(id);
  }

  /**
   * Cancela un pedido borrador o emitido,
   * siempre que no tenga entregas activas.
   *
   * PUT /pedidos/cancelar/:id
   */
  @RequirePermission(RUTA_PEDIDOS, 'modificar')
  @Put('cancelar/:id')
  async cancelar(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CancelarPedidoDTO,
  ) {
    return this.pedidosService.cancelar(id, body);
  }

  /**
   * Cierra formalmente un pedido parcial cuando
   * el proveedor no entregará las unidades restantes.
   *
   * PUT /pedidos/cerrar-incompleto/:id
   */
  @RequirePermission(RUTA_PEDIDOS, 'modificar')
  @Put('cerrar-incompleto/:id')
  async cerrarIncompleto(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CerrarPedidoIncompletoDTO,
  ) {
    return this.pedidosService.cerrarIncompleto(id, body);
  }

  // ==========================================================
  // JOINS Y LISTADOS PARA FORMULARIOS
  // ==========================================================

  @RequirePermission(RUTA_PEDIDOS, 'listar')
  @Get('listar/pedidos')
  async listarPedidos() {
    return this.pedidosService.listarPedidos();
  }

  @RequirePermission(RUTA_PEDIDOS, 'listar')
  @Get('filtrar/pedidos')
  async filtrarPedidos(@Query() queryParams: FilterPedidoDTO) {
    return this.pedidosService.filtrarPedidos(queryParams);
  }

  @RequirePermission(RUTA_PEDIDOS, 'listar')
  @Get('listar/detalles/:id')
  async listarDetallesPedido(@Param('id', ParseIntPipe) id: number) {
    return this.pedidosService.listarDetallesPedido(id);
  }

  // ==========================================================
  // COMBOS
  // ==========================================================

  @RequirePermission(RUTA_PEDIDOS, 'listar')
  @Get('listar/combo/estados')
  async listarComboEstados() {
    return this.pedidosService.listarComboEstados();
  }

  @RequirePermission(RUTA_PEDIDOS, 'listar')
  @Get('listar/combo/motivos')
  async listarComboMotivos() {
    return this.pedidosService.listarComboMotivos();
  }

  /**
   * Devuelve únicamente pedidos abiertos:
   * emitido o parcial.
   */
  @RequirePermission(RUTA_PEDIDOS, 'listar')
  @Get('listar/combo/pedidos')
  async listarComboPedidos() {
    return this.pedidosService.listarComboPedidos();
  }

  /**
   * Devuelve los lotes caducados con stock
   * para un producto específico.
   *
   * Se utiliza al preparar un pedido de
   * devolución/canje.
   */
  @RequirePermission(RUTA_PEDIDOS, 'listar')
  @Get('listar/lotes-caducados/:ideProd')
  async listarLotesCaducadosDisponibles(
    @Param('ideProd', ParseIntPipe)
    ideProd: number,
  ) {
    return this.pedidosService.listarLotesCaducadosDisponibles(ideProd);
  }
}
