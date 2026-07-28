import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  PermissionGuard,
  RequirePermission,
} from 'src/modules/auth/authorization';
import { Roles } from 'src/modules/auth/authorization/roles/roles.decorator';
import { RolesGuard } from 'src/modules/auth/authorization/roles/roles.guard';
import { FilterAccesoUsuarioDto } from './dto/filter_acceso.dto';
import { AccesosUsuariosService } from './accesos.service';

const RUTA_ACCESOS = '/admin/seguridad/accesos';

@UseGuards(AuthGuard('jwt'), RolesGuard, PermissionGuard)
@Roles('padmin', 'pseguridad')
@Controller('accesos')
export class accesosController {
  constructor(private readonly servicio: AccesosUsuariosService) {}

  @RequirePermission(RUTA_ACCESOS, 'listar')
  @Get()
  async listar() {
    return this.servicio.listar();
  }

  @RequirePermission(RUTA_ACCESOS, 'listar')
  @Get('buscar/:id')
  async buscar(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.servicio.buscar(id);
  }

  @RequirePermission(RUTA_ACCESOS, 'listar')
  @Get('filtrar')
  async filtrar(
    @Query()
    queryParams: FilterAccesoUsuarioDto,
  ) {
    return this.servicio.filtrar(queryParams);
  }

  @RequirePermission(RUTA_ACCESOS, 'listar')
  @Get('listar/accesos')
  async listarAccesosUsuarios() {
    return this.servicio.listarAccesos();
  }

  @RequirePermission(RUTA_ACCESOS, 'listar')
  @Get('filtrar/accesos')
  async filtrarAccesosUsuarios(
    @Query()
    queryParams: FilterAccesoUsuarioDto,
  ) {
    return this.servicio.filtrarAccesos(queryParams);
  }

  @RequirePermission(RUTA_ACCESOS, 'listar')
  @Get('listar/combo/ips')
  async listarComboIps() {
    return this.servicio.listarComboIps();
  }

  @RequirePermission(RUTA_ACCESOS, 'listar')
  @Get('listar/combo/navegador')
  async listarComboNavegador() {
    return this.servicio.listarComboNavegador();
  }

  @RequirePermission(RUTA_ACCESOS, 'listar')
  @Get('listar/combo/motivo')
  async listarComboMotivos() {
    return this.servicio.listarComboMotivos();
  }

  @RequirePermission(RUTA_ACCESOS, 'listar')
  @Get('listar/combo/cuentas')
  async listarComboCuentas() {
    return this.servicio.listarComboCuentas();
  }
}
