import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IdUtil } from '@common/index';
import { CreateVentaClienteDto } from './dto';
import { MobileVentasService } from './ventas.service';

/**
 * Controller para ventas desde la app móvil.
 *
 * Todas las rutas requieren JWT de cliente.
 */
@UseGuards(AuthGuard('jwt'))
@Controller('mobile/ventas')
export class MobileVentasController {
  constructor(private readonly ventasService: MobileVentasService) {}

  /**
   * Crear una nueva venta.
   *
   * POST /mobile/ventas
   */
  @Post()
  async crearVenta(@Body() body: CreateVentaClienteDto, @Req() req: any) {
    const clienteToken = this.obtenerIdClienteDesdeToken(req);
    const clienteBody = IdUtil.requireId(
      body.cabeceraVenta?.ideClie,
      'El ID del cliente de la venta no es válido.',
    );

    if (clienteBody !== clienteToken) {
      throw new BadRequestException(
        'El cliente de la venta no coincide con el usuario autenticado.',
      );
    }

    return this.ventasService.crearVenta(body, clienteToken);
  }

  /**
   * Obtener historial de compras del cliente autenticado.
   *
   * GET /mobile/ventas/historial
   */
  @Get('historial')
  async obtenerHistorial(@Req() req: any) {
    const clienteId = this.obtenerIdClienteDesdeToken(req);

    return this.ventasService.obtenerHistorialCliente(clienteId);
  }

  /**
   * Obtener detalle de una venta específica.
   *
   * GET /mobile/ventas/:id
   */
  @Get(':id')
  async obtenerDetalle(@Param('id') id: string, @Req() req: any) {
    const clienteId = this.obtenerIdClienteDesdeToken(req);
    const ideVent = IdUtil.requireId(id, 'El ID de la venta no es válido.');

    return this.ventasService.obtenerDetalleVenta(ideVent, clienteId);
  }

  private obtenerIdClienteDesdeToken(req: any): number {
    const ideClie = IdUtil.parseId(req.user?.ide_clie);

    if (ideClie === null) {
      throw new UnauthorizedException('Cliente no autenticado.');
    }

    return ideClie;
  }
}
