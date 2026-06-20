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
import { CreatePedidoDTO } from './dto/create_pedido.dto';
import { FilterPedidoDTO } from './dto/filter_pedido.dto';
import { UpdatePedidoDTO } from './dto/update_pedido.dto';
import { PedidosService } from './pedidos.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('padmin', 'pbodega')
@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

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

  /**
   * JOINS
   */
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

  /**
   * COMBOS
   */
  @Get('listar/combo/estados')
  async listarComboEstados() {
    return this.pedidosService.listarComboEstados();
  }

  @Get('listar/combo/motivos')
  async listarComboMotivos() {
    return this.pedidosService.listarComboMotivos();
  }

  @Get('listar/combo/pedidos')
  async listarComboPedidos() {
    return this.pedidosService.listarComboPedidos();
  }
}
