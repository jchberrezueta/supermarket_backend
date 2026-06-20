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
import { CreatePerfilDto } from './dto/create_perfil.dto';
import { FilterPerfilDto } from './dto/filter_perfil.dto';
import { UpdatePerfilDto } from './dto/update_perfil.dto';
import { PerfilesService } from './perfiles.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('padmin', 'pseguridad')
@Controller('perfiles')
export class PerfilesController {
  constructor(private readonly perfilesService: PerfilesService) {}

  @Get()
  async listar() {
    return this.perfilesService.listar();
  }

  @Get('buscar/:id')
  async buscar(@Param('id', ParseIntPipe) id: number) {
    return this.perfilesService.buscar(id);
  }

  @Get('filtrar')
  async filtrar(@Query() queryParams: FilterPerfilDto) {
    return this.perfilesService.filtrar(queryParams);
  }

  @Post('insertar')
  async insertar(@Body() body: CreatePerfilDto) {
    return this.perfilesService.insertar(body);
  }

  @Put('actualizar/:id')
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePerfilDto,
  ) {
    body.idePerf = id;

    return this.perfilesService.actualizar(body);
  }

  @Delete('eliminar/:id')
  async eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.perfilesService.eliminar(id);
  }

  /**
   * JOINS
   */
  @Get('listar/perfiles')
  async listarPerfiles() {
    return this.perfilesService.listarPerfiles();
  }

  @Get('filtrar/perfiles')
  async filtrarPerfiles(@Query() queryParams: FilterPerfilDto) {
    return this.perfilesService.filtrarPerfiles(queryParams);
  }

  /**
   * COMBOS
   */
  @Get('listar/combo/perfiles')
  async listarComboPerfiles() {
    return this.perfilesService.listarComboPerfiles();
  }

  @Get('listar/combo/nombres')
  async listarComboNombres() {
    return this.perfilesService.listarComboNombres();
  }

  @Get('listar/combo/descripciones')
  async listarComboDescripcion() {
    return this.perfilesService.listarComboDescripcion();
  }

  @Get('listar/combo/roles')
  async listarComboRoles() {
    return this.perfilesService.listarComboRoles();
  }
}
