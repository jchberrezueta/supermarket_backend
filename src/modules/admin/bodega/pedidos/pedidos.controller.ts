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
import { CancelarPedidoDTO } from './dto/cancelar_pedido.dto';
import { CerrarPedidoIncompletoDTO } from './dto/cerrar_pedido_incompleto.dto';
import { CreatePedidoDTO } from './dto/create_pedido.dto';
import { FilterPedidoDTO } from './dto/filter_pedido.dto';
import { UpdatePedidoDTO } from './dto/update_pedido.dto';
import { PedidosService } from './pedidos.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('padmin', 'pbodega')
@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  // ==========================================================
  // CONSULTAS
  // ==========================================================

  @Get()
  async listar() {
    return this.pedidosService.listar();
  }

  @Get('buscar/:id')
  async buscar(@Param('id', ParseIntPipe) id: number) {
    return this.pedidosService.buscar(id);
  }

  @Get('filtrar')
  async filtrar(@Query() queryParams: FilterPedidoDTO) {
    return this.pedidosService.filtrar(queryParams);
  }

  // ==========================================================
  // BORRADOR
  // ==========================================================

  @Post('insertar')
  async insertar(@Body() body: CreatePedidoDTO) {
    return this.pedidosService.insertar(body);
  }

  @Put('actualizar/:id')
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePedidoDTO,
  ) {
    body.cabeceraPedido.idePedi = id;

    return this.pedidosService.actualizar(body);
  }

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

  @Get('listar/pedidos')
  async listarPedidos() {
    return this.pedidosService.listarPedidos();
  }

  @Get('filtrar/pedidos')
  async filtrarPedidos(@Query() queryParams: FilterPedidoDTO) {
    return this.pedidosService.filtrarPedidos(queryParams);
  }

  @Get('listar/detalles/:id')
  async listarDetallesPedido(@Param('id', ParseIntPipe) id: number) {
    return this.pedidosService.listarDetallesPedido(id);
  }

  // ==========================================================
  // COMBOS
  // ==========================================================

  @Get('listar/combo/estados')
  async listarComboEstados() {
    return this.pedidosService.listarComboEstados();
  }

  @Get('listar/combo/motivos')
  async listarComboMotivos() {
    return this.pedidosService.listarComboMotivos();
  }

  /**
   * Devuelve únicamente pedidos abiertos:
   * emitido o parcial.
   */
  @Get('listar/combo/pedidos')
  async listarComboPedidos() {
    return this.pedidosService.listarComboPedidos();
  }
}
