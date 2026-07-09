import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IdUtil } from '@common/index';
import { CreateMetodoPagoDto, UpdateMetodoPagoDto } from './dto';
import { MetodosPagoService } from './metodos-pago.service';

@Controller('mobile/metodos-pago')
@UseGuards(AuthGuard('jwt'))
export class MetodosPagoController {
  constructor(private readonly metodosPagoService: MetodosPagoService) {}

  /**
   * Crear nuevo método de pago.
   *
   * POST /mobile/metodos-pago
   */
  @Post()
  async crearMetodoPago(
    @Body() body: CreateMetodoPagoDto,
    @Request() req: any,
  ) {
    const idCliente = this.obtenerIdClienteDesdeToken(req);

    body.ideClie = idCliente;
    body.usuaIngre = req.user?.username || 'mobile';

    return this.metodosPagoService.crearMetodoPago(body);
  }

  /**
   * Listar métodos de pago del cliente autenticado.
   *
   * GET /mobile/metodos-pago
   */
  @Get()
  async listarMetodosPago(@Request() req: any) {
    const idCliente = this.obtenerIdClienteDesdeToken(req);

    return this.metodosPagoService.listarMetodosPago(idCliente);
  }

  /**
   * Obtener método de pago por ID.
   *
   * GET /mobile/metodos-pago/:id
   */
  @Get(':id')
  async obtenerMetodoPago(@Param('id') id: string, @Request() req: any) {
    const idCliente = this.obtenerIdClienteDesdeToken(req);
    const ideMetoPago = IdUtil.requireId(
      id,
      'El ID del método de pago no es válido.',
    );

    return this.metodosPagoService.obtenerMetodoPago(ideMetoPago, idCliente);
  }

  /**
   * Actualizar método de pago.
   *
   * PUT /mobile/metodos-pago/:id
   */
  @Put(':id')
  async actualizarMetodoPago(
    @Param('id') id: string,
    @Body() body: UpdateMetodoPagoDto,
    @Request() req: any,
  ) {
    const idCliente = this.obtenerIdClienteDesdeToken(req);

    body.ideMetoPago = IdUtil.requireId(
      id,
      'El ID del método de pago no es válido.',
    );
    body.usuaActua = req.user?.username || 'mobile';

    return this.metodosPagoService.actualizarMetodoPago(body, idCliente);
  }

  /**
   * Eliminar método de pago.
   *
   * DELETE /mobile/metodos-pago/:id
   */
  @Delete(':id')
  async eliminarMetodoPago(@Param('id') id: string, @Request() req: any) {
    const idCliente = this.obtenerIdClienteDesdeToken(req);
    const ideMetoPago = IdUtil.requireId(
      id,
      'El ID del método de pago no es válido.',
    );
    const usuaActua = req.user?.username || 'mobile';

    return this.metodosPagoService.eliminarMetodoPago(
      ideMetoPago,
      idCliente,
      usuaActua,
    );
  }

  /**
   * Establecer como predeterminado.
   *
   * PUT /mobile/metodos-pago/:id/predeterminado
   */
  @Put(':id/predeterminado')
  async establecerPredeterminado(@Param('id') id: string, @Request() req: any) {
    const idCliente = this.obtenerIdClienteDesdeToken(req);
    const ideMetoPago = IdUtil.requireId(
      id,
      'El ID del método de pago no es válido.',
    );

    return this.metodosPagoService.establecerPredeterminado(
      ideMetoPago,
      idCliente,
    );
  }

  private obtenerIdClienteDesdeToken(req: any): number {
    return IdUtil.requireId(
      req.user?.ide_clie,
      'No se pudo obtener el ID del cliente autenticado.',
    );
  }
}
