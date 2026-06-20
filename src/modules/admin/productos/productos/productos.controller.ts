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
import { CreateProductoDTO } from './dto/create_producto.dto';
import { FilterProductoDTO } from './dto/filter_producto.dto';
import { UpdateProductoDTO } from './dto/update_producto.dto';
import { ProductosService } from './productos.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('padmin', 'pinventario')
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Get()
  async listar() {
    return this.productosService.listar();
  }

  @Get('codigo/:codigo')
  async buscarActivoPorCodigo(@Param('codigo') codigo: string) {
    return this.productosService.buscarActivoPorCodigo(codigo);
  }

  @Get('buscar/:id')
  async buscar(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.buscar(id);
  }

  @Get('filtrar')
  async filtrar(@Query() queryParams: FilterProductoDTO) {
    return this.productosService.filtrar(queryParams);
  }

  @Post('insertar')
  async insertar(@Body() body: CreateProductoDTO) {
    return this.productosService.insertar(body);
  }

  @Put('actualizar/:id')
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProductoDTO,
  ) {
    body.ideProd = id;

    return this.productosService.actualizar(body);
  }

  @Delete('eliminar/:id')
  async eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.eliminar(id);
  }

  /**
   * JOINS
   */
  @Get('listar/productos')
  async listarProductos() {
    return this.productosService.listarProductos();
  }

  @Get('filtrar/productos')
  async filtrarProductos(@Query() queryParams: FilterProductoDTO) {
    return this.productosService.filtrarProductos(queryParams);
  }

  /**
   * COMBOS
   */
  @Get('listar/combo/productos')
  async listarComboProductos() {
    return this.productosService.listarComboProductos();
  }

  @Get('listar/combo/codigo/barras')
  async listarComboCodigosBarras() {
    return this.productosService.listarComboCodigosBarras();
  }

  @Get('listar/combo/estados')
  async listarComboEstados() {
    return this.productosService.listarComboEstados();
  }

  @Get('listar/combo/disponibilidad')
  async listarComboDisponibilidad() {
    return this.productosService.listarComboDisponibilidad();
  }
}
