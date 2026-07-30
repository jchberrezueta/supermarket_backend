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
import { CreateProveedorDTO } from './dto/create_proveedor.dto';
import { FilterProveedorDTO } from './dto/filter_proveedor.dto';
import { UpdateProveedorDTO } from './dto/update_proveedor.dto';
import { ProveedoresService } from './proveedores.service';

const RUTA_PROVEEDORES = '/admin/proveedores/proveedores';

@UseGuards(AuthGuard('jwt'), PermissionGuard)
@Controller('proveedores')
export class ProveedoresController {
  constructor(private readonly proveedoresService: ProveedoresService) {}

  @RequirePermission(RUTA_PROVEEDORES, 'listar')
  @Get()
  async listar() {
    return this.proveedoresService.listar();
  }

  @RequirePermission(RUTA_PROVEEDORES, 'listar')
  @Get('buscar/:id')
  async buscar(@Param('id', ParseIntPipe) id: number) {
    return this.proveedoresService.buscar(id);
  }

  @RequirePermission(RUTA_PROVEEDORES, 'listar')
  @Get('filtrar')
  async filtrar(@Query() queryParams: FilterProveedorDTO) {
    return this.proveedoresService.filtrar(queryParams);
  }

  @RequirePermission(RUTA_PROVEEDORES, 'insertar')
  @Post('insertar')
  async insertar(@Body() body: CreateProveedorDTO) {
    return this.proveedoresService.insertar(body);
  }

  @RequirePermission(RUTA_PROVEEDORES, 'modificar')
  @Put('actualizar/:id')
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProveedorDTO,
  ) {
    body.ideProv = id;

    return this.proveedoresService.actualizar(body);
  }

  @RequirePermission(RUTA_PROVEEDORES, 'eliminar')
  @Delete('eliminar/:id')
  async eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.proveedoresService.eliminar(id);
  }

  /**
   * JOINS
   */
  @RequirePermission(RUTA_PROVEEDORES, 'listar')
  @Get('listar/proveedores')
  async listarProveedores() {
    return this.proveedoresService.listarProveedores();
  }

  @RequirePermission(RUTA_PROVEEDORES, 'listar')
  @Get('filtrar/proveedores')
  async filtrarProveedores(@Query() queryParams: FilterProveedorDTO) {
    return this.proveedoresService.filtrarProveedores(queryParams);
  }

  @RequirePermission(RUTA_PROVEEDORES, 'listar')
  @Get('buscar/proveedor/:id')
  async buscarProveedor(@Param('id', ParseIntPipe) id: number) {
    return this.proveedoresService.buscarProveedor(id);
  }

  /**
   * COMBOS
   */
  @RequirePermission(RUTA_PROVEEDORES, 'listar')
  @Get('listar/proveedores/combo/proveedores')
  async listarComboProveedores() {
    return this.proveedoresService.listarComboProveedores();
  }
  @RequirePermission(RUTA_PROVEEDORES, 'listar')
  @Get('listar/proveedores/combo/estados')
  async listarComboEstados() {
    return this.proveedoresService.listarComboEstados();
  }

  @RequirePermission(RUTA_PROVEEDORES, 'listar')
  @Get('listar/proveedores/combo/cedula')
  async listarProveedoresComboCedula() {
    return this.proveedoresService.listarComboProveedorCedula();
  }

  @RequirePermission(RUTA_PROVEEDORES, 'listar')
  @Get('listar/proveedores/combo/nombres')
  async listarProveedoresComboNombres() {
    return this.proveedoresService.listarComboProveedorNombres();
  }

  @RequirePermission(RUTA_PROVEEDORES, 'listar')
  @Get('listar/proveedores/combo/primer/nombre')
  async listarProveedoresComboPrimerNombre() {
    return this.proveedoresService.listarComboProveedorPrimerNombre();
  }

  @RequirePermission(RUTA_PROVEEDORES, 'listar')
  @Get('listar/proveedores/combo/apellido/paterno')
  async listarProveedoresComboApellidoPaterno() {
    return this.proveedoresService.listarComboProveedorApellidoPaterno();
  }

  @RequirePermission(RUTA_PROVEEDORES, 'listar')
  @Get('listar/proveedores/combo/email')
  async listarProveedoresComboEmail() {
    return this.proveedoresService.listarComboProveedorEmail();
  }
}
