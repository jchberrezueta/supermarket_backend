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
import { CreateEmpleadoDTO } from './dto/create_empleado.dto';
import { FilterEmpleadoDTO } from './dto/filter_empleado.dto';
import { UpdateEmpleadoDTO } from './dto/update_empleado.dto';
import { EmpleadosService } from './empleados.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('padmin', 'prrhh')
@Controller('empleados')
export class EmpleadosController {
  constructor(private readonly empleadosService: EmpleadosService) {}

  @Get()
  async listar() {
    return this.empleadosService.listar();
  }

  @Get('buscar/:id')
  async buscar(@Param('id', ParseIntPipe) id: number) {
    return this.empleadosService.buscar(id);
  }

  @Get('filtrar')
  async filtrar(@Query() queryParams: FilterEmpleadoDTO) {
    return this.empleadosService.filtrar(queryParams);
  }

  @Post('insertar')
  async insertar(@Body() body: CreateEmpleadoDTO) {
    return this.empleadosService.insertar(body);
  }

  @Put('actualizar/:id')
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateEmpleadoDTO,
  ) {
    body.ideEmpl = id;

    return this.empleadosService.actualizar(body);
  }

  @Delete('eliminar/:id')
  async eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.empleadosService.eliminar(id);
  }

  /**
   * JOINS
   */
  @Get('listar/empleados')
  async listarEmpleados() {
    return this.empleadosService.listarEmpleados();
  }

  @Get('filtrar/empleados')
  async filtrarEmpleados(@Query() queryParams: FilterEmpleadoDTO) {
    return this.empleadosService.filtrarEmpleados(queryParams);
  }

  /**
   * COMBOS
   */
  @Get('listar/combo/empleados')
  async listarComboEmpleados() {
    return this.empleadosService.listarComboEmpleados();
  }

  @Get('listar/combo/cedulas')
  async listarComboCedulas() {
    return this.empleadosService.listarComboCedulas();
  }

  @Get('listar/combo/primer/nombre')
  async listarComboPrimerNombre() {
    return this.empleadosService.listarComboPrimerNombre();
  }

  @Get('listar/combo/apellido/paterno')
  async listarComboApellidoPaterno() {
    return this.empleadosService.listarComboApellidoPaterno();
  }

  @Get('listar/combo/titulos')
  async listarComboTitulos() {
    return this.empleadosService.listarComboTitulos();
  }

  @Get('listar/combo/estados')
  async listarComboEstados() {
    return this.empleadosService.listarComboEstados();
  }

  @Get('listar/combo/roles')
  async listarComboRoles() {
    return this.empleadosService.listarComboRoles();
  }
}
