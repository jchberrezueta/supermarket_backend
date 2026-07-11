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
import { AnularEntregaDTO } from './dto/anular_entrega.dto';
import { CreateEntregaDTO } from './dto/create_entrega.dto';
import { FilterEntregaDTO } from './dto/filter_entrega.dto';
import { UpdateEntregaDTO } from './dto/update_entrega.dto';
import { EntregasService } from './entregas.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('padmin', 'pbodega')
@Controller('entregas')
export class EntregasController {
  constructor(private readonly entregasService: EntregasService) {}

  @Get()
  async listar() {
    return this.entregasService.listar();
  }

  @Get('buscar/:id')
  async buscar(@Param('id', ParseIntPipe) id: number) {
    return this.entregasService.buscar(id);
  }

  @Get('filtrar')
  async filtrar(@Query() queryParams: FilterEntregaDTO) {
    return this.entregasService.filtrar(queryParams);
  }

  @Post('insertar')
  async insertar(@Body() body: CreateEntregaDTO) {
    return this.entregasService.insertar(body);
  }

  @Put('actualizar/:id')
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateEntregaDTO,
  ) {
    body.cabeceraEntrega.ideEntr = id;

    return this.entregasService.actualizar(body);
  }

  @Put('confirmar/:id')
  async confirmar(@Param('id', ParseIntPipe) id: number) {
    return this.entregasService.confirmar(id);
  }

  @Put('anular/:id')
  async anular(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: AnularEntregaDTO,
  ) {
    return this.entregasService.anular(id, body);
  }

  @Delete('eliminar/:id')
  async eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.entregasService.eliminar(id);
  }

  /**
   * JOINS
   */
  @Get('listar/entregas')
  async listarEntregas() {
    return this.entregasService.listarEntregas();
  }

  @Get('filtrar/pedidos')
  async filtrarEntregas(@Query() queryParams: FilterEntregaDTO) {
    return this.entregasService.filtrarEntregas(queryParams);
  }

  @Get('listar/detalles/:id')
  async listarDetallesEntrega(@Param('id', ParseIntPipe) id: number) {
    return this.entregasService.listarDetallesEntrega(id);
  }

  /**
   * COMBOS
   */
  @Get('listar/combo/estados')
  async listarComboEstados() {
    return this.entregasService.listarComboEstados();
  }
}
