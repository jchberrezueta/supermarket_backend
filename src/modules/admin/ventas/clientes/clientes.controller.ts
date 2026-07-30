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
import { ClientesService } from './clientes.service';
import { CreateClienteDTO } from './dto/create_cliente.dto';
import { FilterClienteDTO } from './dto/filter_cliente.dto';
import { UpdateClienteDTO } from './dto/update_cliente.dto';

const RUTA_CLIENTES = '/admin/ventas/clientes';

@UseGuards(AuthGuard('jwt'), PermissionGuard)
@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @RequirePermission(RUTA_CLIENTES, 'listar')
  @Get()
  async listar() {
    return this.clientesService.listar();
  }

  @RequirePermission(RUTA_CLIENTES, 'listar')
  @Get('buscar/:id')
  async buscar(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.buscar(id);
  }

  @RequirePermission(RUTA_CLIENTES, 'listar')
  @Get('filtrar')
  async filtrar(@Query() queryParams: FilterClienteDTO) {
    return this.clientesService.filtrar(queryParams);
  }

  @RequirePermission(RUTA_CLIENTES, 'insertar')
  @Post('insertar')
  async insertar(@Body() body: CreateClienteDTO) {
    return this.clientesService.insertar(body);
  }

  @RequirePermission(RUTA_CLIENTES, 'modificar')
  @Put('actualizar/:id')
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateClienteDTO,
  ) {
    body.ideClie = id;

    return this.clientesService.actualizar(body);
  }

  @RequirePermission(RUTA_CLIENTES, 'eliminar')
  @Delete('eliminar/:id')
  async eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.eliminar(id);
  }

  /**
   * JOINS
   */
  @RequirePermission(RUTA_CLIENTES, 'listar')
  @Get('listar/clientes')
  async listarClientes() {
    return this.clientesService.listarClientes();
  }

  /**
   * COMBOS
   */
  @RequirePermission(RUTA_CLIENTES, 'listar')
  @Get('listar/combo/clientes')
  async listarComboClientes() {
    return this.clientesService.listarComboClientes();
  }

  @RequirePermission(RUTA_CLIENTES, 'listar')
  @Get('listar/combo/cedulas')
  async listarComboCedulas() {
    return this.clientesService.listarComboCedulas();
  }

  @RequirePermission(RUTA_CLIENTES, 'listar')
  @Get('listar/combo/nombres')
  async listarComboNombres() {
    return this.clientesService.listarComboNombres();
  }

  @RequirePermission(RUTA_CLIENTES, 'listar')
  @Get('listar/combo/apellidos')
  async listarComboApellidos() {
    return this.clientesService.listarComboApellidos();
  }

  @RequirePermission(RUTA_CLIENTES, 'listar')
  @Get('listar/combo/socios')
  async listarComboSocio() {
    return this.clientesService.listarComboSocio();
  }

  @RequirePermission(RUTA_CLIENTES, 'listar')
  @Get('listar/combo/tercera/edad')
  async listarComboTerceraEdad() {
    return this.clientesService.listarComboTerceraEdad();
  }
}
