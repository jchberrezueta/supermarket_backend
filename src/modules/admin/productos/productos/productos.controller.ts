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
import { CreateProductoDTO } from './dto/create_producto.dto';
import { FilterProductoDTO } from './dto/filter_producto.dto';
import { UpdateProductoDTO } from './dto/update_producto.dto';
import { ProductosService } from './productos.service';

const RUTA_PRODUCTOS = '/admin/productos/productos';

@UseGuards(AuthGuard('jwt'), PermissionGuard)
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @RequirePermission(RUTA_PRODUCTOS, 'listar')
  @Get()
  async listar() {
    return this.productosService.listar();
  }

  @RequirePermission(RUTA_PRODUCTOS, 'listar')
  @Get('codigo/:codigo')
  async buscarActivoPorCodigo(@Param('codigo') codigo: string) {
    return this.productosService.buscarActivoPorCodigo(codigo);
  }

  @RequirePermission(RUTA_PRODUCTOS, 'listar')
  @Get('buscar/:id')
  async buscar(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.buscar(id);
  }

  @RequirePermission(RUTA_PRODUCTOS, 'listar')
  @Get('filtrar')
  async filtrar(@Query() queryParams: FilterProductoDTO) {
    return this.productosService.filtrar(queryParams);
  }

  @RequirePermission(RUTA_PRODUCTOS, 'insertar')
  @Post('insertar')
  async insertar(@Body() body: CreateProductoDTO) {
    return this.productosService.insertar(body);
  }

  @RequirePermission(RUTA_PRODUCTOS, 'modificar')
  @Put('actualizar/:id')
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProductoDTO,
  ) {
    body.ideProd = id;

    return this.productosService.actualizar(body);
  }

  @RequirePermission(RUTA_PRODUCTOS, 'eliminar')
  @Delete('eliminar/:id')
  async eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.eliminar(id);
  }

  /**
   * JOINS
   */
  @RequirePermission(RUTA_PRODUCTOS, 'listar')
  @Get('listar/productos')
  async listarProductos() {
    return this.productosService.listarProductos();
  }

  @RequirePermission(RUTA_PRODUCTOS, 'listar')
  @Get('filtrar/productos')
  async filtrarProductos(@Query() queryParams: FilterProductoDTO) {
    return this.productosService.filtrarProductos(queryParams);
  }

  /**
   * COMBOS
   */
  @RequirePermission(RUTA_PRODUCTOS, 'listar')
  @Get('listar/combo/productos')
  async listarComboProductos() {
    return this.productosService.listarComboProductos();
  }

  @RequirePermission(RUTA_PRODUCTOS, 'listar')
  @Get('listar/combo/productos/activos')
  async listarComboProductosActivos() {
    return this.productosService.listarComboProductosActivos();
  }

  @RequirePermission(RUTA_PRODUCTOS, 'listar')
  @Get('listar/combo/productos/activos/empresa/:id')
  async listarComboProductosActivosSinPrecioPorEmpresa(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.productosService.listarComboProductosActivosSinPrecioPorEmpresa(
      id,
    );
  }

  @RequirePermission(RUTA_PRODUCTOS, 'listar')
  @Get('listar/combo/codigo/barras')
  async listarComboCodigosBarras() {
    return this.productosService.listarComboCodigosBarras();
  }

  @RequirePermission(RUTA_PRODUCTOS, 'listar')
  @Get('listar/combo/estados')
  async listarComboEstados() {
    return this.productosService.listarComboEstados();
  }

  @RequirePermission(RUTA_PRODUCTOS, 'listar')
  @Get('listar/combo/disponibilidad')
  async listarComboDisponibilidad() {
    return this.productosService.listarComboDisponibilidad();
  }
}
