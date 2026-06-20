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
import { ClientesService } from './clientes.service';
import { CreateClienteDTO } from './dto/create_cliente.dto';
import { FilterClienteDTO } from './dto/filter_cliente.dto';
import { UpdateClienteDTO } from './dto/update_cliente.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('padmin', 'pventas')
@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Get()
  async listar() {
    return this.clientesService.listar();
  }

  @Get('buscar/:id')
  async buscar(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.buscar(id);
  }

  @Get('filtrar')
  async filtrar(@Query() queryParams: FilterClienteDTO) {
    return this.clientesService.filtrar(queryParams);
  }

  @Post('insertar')
  async insertar(@Body() body: CreateClienteDTO) {
    return this.clientesService.insertar(body);
  }

  @Put('actualizar/:id')
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateClienteDTO,
  ) {
    body.ideClie = id;

    return this.clientesService.actualizar(body);
  }

  @Delete('eliminar/:id')
  async eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.eliminar(id);
  }

  /**
   * JOINS
   */
  @Get('listar/clientes')
  async listarClientes() {
    return this.clientesService.listarClientes();
  }

  /**
   * COMBOS
   */
  @Get('listar/combo/clientes')
  async listarComboClientes() {
    return this.clientesService.listarComboClientes();
  }

  @Get('listar/combo/cedulas')
  async listarComboCedulas() {
    return this.clientesService.listarComboCedulas();
  }

  @Get('listar/combo/nombres')
  async listarComboNombres() {
    return this.clientesService.listarComboNombres();
  }

  @Get('listar/combo/apellidos')
  async listarComboApellidos() {
    return this.clientesService.listarComboApellidos();
  }

  @Get('listar/combo/socios')
  async listarComboSocio() {
    return this.clientesService.listarComboSocio();
  }

  @Get('listar/combo/tercera/edad')
  async listarComboTerceraEdad() {
    return this.clientesService.listarComboTerceraEdad();
  }
}
