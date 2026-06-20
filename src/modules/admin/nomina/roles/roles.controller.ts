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
import { CreateRolDTO } from './dto/create_rol.dto';
import { FilterRolDTO } from './dto/filter_rol.dto';
import { UpdateRolDTO } from './dto/update_rol.dto';
import { RolesService } from './roles.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('padmin', 'prrhh')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  async listar() {
    return this.rolesService.listar();
  }

  @Get('buscar/:id')
  async buscar(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.buscar(id);
  }

  @Get('filtrar')
  async filtrar(@Query() queryParams: FilterRolDTO) {
    return this.rolesService.filtrar(queryParams);
  }

  @Post('insertar')
  async insertar(@Body() body: CreateRolDTO) {
    return this.rolesService.insertar(body);
  }

  @Put('actualizar/:id')
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateRolDTO,
  ) {
    body.ideRol = id;

    return this.rolesService.actualizar(body);
  }

  @Delete('eliminar/:id')
  async eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.eliminar(id);
  }

  /**
   * COMBOS
   */
  @Get('listar/combo/roles')
  async listarComboRoles() {
    return this.rolesService.listarComboRoles();
  }

  @Get('listar/combo/nombres')
  async listarComboNombres() {
    return this.rolesService.listarComboNombres();
  }

  @Get('listar/combo/descripcion')
  async listarComboDescripcion() {
    return this.rolesService.listarComboDescripciones();
  }
}
