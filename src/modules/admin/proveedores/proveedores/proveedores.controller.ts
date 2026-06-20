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
import { CreateProveedorDTO } from './dto/create_proveedor.dto';
import { FilterProveedorDTO } from './dto/filter_proveedor.dto';
import { UpdateProveedorDTO } from './dto/update_proveedor.dto';
import { ProveedoresService } from './proveedores.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('padmin', 'pbodega')
@Controller('proveedores')
export class ProveedoresController {
  constructor(private readonly proveedoresService: ProveedoresService) {}

  @Get()
  async listar() {
    return this.proveedoresService.listar();
  }

  @Get('buscar/:id')
  async buscar(@Param('id', ParseIntPipe) id: number) {
    return this.proveedoresService.buscar(id);
  }

  @Get('filtrar')
  async filtrar(@Query() queryParams: FilterProveedorDTO) {
    return this.proveedoresService.filtrar(queryParams);
  }

  @Post('insertar')
  async insertar(@Body() body: CreateProveedorDTO) {
    return this.proveedoresService.insertar(body);
  }

  @Put('actualizar/:id')
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProveedorDTO,
  ) {
    body.ideProv = id;

    return this.proveedoresService.actualizar(body);
  }

  @Delete('eliminar/:id')
  async eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.proveedoresService.eliminar(id);
  }

  /**
   * JOINS
   */
  @Get('listar/proveedores')
  async listarProveedores() {
    return this.proveedoresService.listarProveedores();
  }

  @Get('filtrar/proveedores')
  async filtrarProveedores(@Query() queryParams: FilterProveedorDTO) {
    return this.proveedoresService.filtrarProveedores(queryParams);
  }

  @Get('buscar/proveedor/:id')
  async buscarProveedor(@Param('id', ParseIntPipe) id: number) {
    return this.proveedoresService.buscarProveedor(id);
  }

  /**
   * COMBOS
   */
  @Get('listar/proveedores/combo/proveedores')
  async listarComboProveedores() {
    return this.proveedoresService.listarComboProveedores();
  }

  @Get('listar/proveedores/combo/cedula')
  async listarProveedoresComboCedula() {
    return this.proveedoresService.listarComboProveedorCedula();
  }

  @Get('listar/proveedores/combo/primer/nombre')
  async listarProveedoresComboPrimerNombre() {
    return this.proveedoresService.listarComboProveedorPrimerNombre();
  }

  @Get('listar/proveedores/combo/apellido/paterno')
  async listarProveedoresComboApellidoPaterno() {
    return this.proveedoresService.listarComboProveedorApellidoPaterno();
  }

  @Get('listar/proveedores/combo/email')
  async listarProveedoresComboEmail() {
    return this.proveedoresService.listarComboProveedorEmail();
  }
}
