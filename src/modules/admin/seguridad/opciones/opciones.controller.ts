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
import { CreateOpcionDto } from './dto/create_opcion.dto';
import { FilterOpcionDto } from './dto/filter_opcion.dto';
import { UpdateOpcionDto } from './dto/update_opcion.dto';
import { OpcionesService } from './opciones.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('padmin', 'pseguridad')
@Controller('opciones')
export class OpcionesController {
  constructor(private readonly opcionesService: OpcionesService) {}

  @Get()
  async listar() {
    return this.opcionesService.listar();
  }

  @Get('buscar/:id')
  async buscar(@Param('id', ParseIntPipe) id: number) {
    return this.opcionesService.buscar(id);
  }

  @Get('filtrar')
  async filtrar(@Query() queryParams: FilterOpcionDto) {
    return this.opcionesService.filtrar(queryParams);
  }

  @Post('insertar')
  async insertar(@Body() body: CreateOpcionDto) {
    return this.opcionesService.insertar(body);
  }

  @Put('actualizar/:id')
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateOpcionDto,
  ) {
    body.ideOpci = id;

    return this.opcionesService.actualizar(body);
  }

  @Delete('eliminar/:id')
  async eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.opcionesService.eliminar(id);
  }

  /**
   * COMBOS
   */
  @Get('listar/combo/nombres')
  async listarComboNombres() {
    return this.opcionesService.listarComboNombres();
  }

  @Get('listar/combo/rutas')
  async listarComboRutas() {
    return this.opcionesService.listarComboRutas();
  }

  @Get('listar/combo/estados')
  async listarComboEstados() {
    return this.opcionesService.listarComboEstados();
  }
}
