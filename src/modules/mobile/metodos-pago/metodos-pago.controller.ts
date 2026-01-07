import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MetodosPagoService } from './metodos-pago.service';
import { CreateMetodoPagoDto, UpdateMetodoPagoDto } from './dto';

@Controller('mobile/metodos-pago')
@UseGuards(AuthGuard('jwt'))
export class MetodosPagoController {

    constructor(private readonly metodosPagoService: MetodosPagoService) {}

    /**
     * Crear nuevo método de pago
     * POST /mobile/metodos-pago
     */
    @Post()
    async crearMetodoPago(@Body() body: CreateMetodoPagoDto, @Request() req: any) {
        // Obtener idCliente del token JWT
        const idCliente = req.user?.ide_clie;
        if (!idCliente) {
            throw new BadRequestException('No se pudo obtener el ID del cliente');
        }
        body.ideClie = idCliente;
        body.usuaIngre = req.user?.username || 'mobile';
        return this.metodosPagoService.crearMetodoPago(body);
    }

    /**
     * Listar métodos de pago del cliente autenticado
     * GET /mobile/metodos-pago
     */
    @Get()
    async listarMetodosPago(@Request() req: any) {
        const idCliente = req.user?.ide_clie;
        return this.metodosPagoService.listarMetodosPago(idCliente);
    }

    /**
     * Obtener método de pago por ID
     * GET /mobile/metodos-pago/:id
     */
    @Get(':id')
    async obtenerMetodoPago(@Param('id') id: string, @Request() req: any) {
        const idCliente = req.user?.ide_clie;
        return this.metodosPagoService.obtenerMetodoPago(+id, idCliente);
    }

    /**
     * Actualizar método de pago
     * PUT /mobile/metodos-pago/:id
     */
    @Put(':id')
    async actualizarMetodoPago(
        @Param('id') id: string, 
        @Body() body: UpdateMetodoPagoDto,
        @Request() req: any
    ) {
        body.ideMetoPago = +id;
        body.usuaActua = req.user?.username || 'mobile';
        return this.metodosPagoService.actualizarMetodoPago(body);
    }

    /**
     * Eliminar método de pago
     * DELETE /mobile/metodos-pago/:id
     */
    @Delete(':id')
    async eliminarMetodoPago(@Param('id') id: string, @Request() req: any) {
        const usuaActua = req.user?.username || 'mobile';
        return this.metodosPagoService.eliminarMetodoPago(+id, usuaActua);
    }

    /**
     * Establecer como predeterminado
     * PUT /mobile/metodos-pago/:id/predeterminado
     */
    @Put(':id/predeterminado')
    async establecerPredeterminado(@Param('id') id: string, @Request() req: any) {
        const idCliente = req.user?.ide_clie;
        return this.metodosPagoService.establecerPredeterminado(+id, idCliente);
    }
}
