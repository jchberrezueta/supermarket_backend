import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/modules/auth/roles.decorator';
import { RolesGuard } from 'src/modules/auth/roles.guard';
import { CreateAccesoUsuarioDto } from './dto/create_acceso.dto';
import { FilterAccesoUsuarioDto } from './dto/filter_acceso.dto';
import { AccesosUsuariosService } from './accesos.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('padmin', 'pseguridad')
@Controller('accesos')
export class accesosController {
  constructor(private readonly servicio: AccesosUsuariosService) {}

  @Get()
  async listar() {
    return this.servicio.listar();
  }

  @Get('buscar/:id')
  async buscar(@Param('id', ParseIntPipe) id: number) {
    return this.servicio.buscar(id);
  }

  @Get('filtrar')
  async filtrar(@Query() queryParams: FilterAccesoUsuarioDto) {
    return this.servicio.filtrar(queryParams);
  }

  @Post('insertar')
  async insertar(@Body() body: CreateAccesoUsuarioDto) {
    return this.servicio.insertarAccesoUsuario(body);
  }

  /**
   * JOINS
   */
  @Get('listar/accesos')
  async listarAccesosUsuarios() {
    return this.servicio.listarAccesos();
  }

  @Get('filtrar/accesos')
  async filtrarAccesosUsuarios(@Query() queryParams: FilterAccesoUsuarioDto) {
    return this.servicio.filtrarAccesos(queryParams);
  }

  /**
   * COMBOS
   */
  @Get('listar/combo/ips')
  async listarComboIps() {
    return this.servicio.listarComboIps();
  }

  @Get('listar/combo/navegador')
  async listarComboNavegador() {
    return this.servicio.listarComboNavegador();
  }

  @Get('listar/combo/cuentas')
  async listarComboCuentas() {
    return this.servicio.listarComboCuentas();
  }
}
