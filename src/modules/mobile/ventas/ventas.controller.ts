import { Controller, Get, Post, Body, Param, UseGuards, Req, BadRequestException, UnauthorizedException, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MobileVentasService } from './ventas.service';
import { CreateVentaClienteDto } from './dto';

/**
 * Controller para ventas desde la app móvil
 * REQUIERE autenticación JWT de cliente
 */
@UseGuards(AuthGuard('jwt'))
@Controller('mobile/ventas')
export class MobileVentasController {

    constructor(private readonly ventasService: MobileVentasService) {}

    /**
     * Crear una nueva venta
     * POST /mobile/ventas
     */
    @Post()
    async crearVenta(@Body() body: CreateVentaClienteDto, @Req() req: any) {
        console.log('=== CREAR VENTA ===');
        console.log('Body recibido:', JSON.stringify(body, null, 2));
        console.log('User del token:', req.user);
        
        // Verificar que el cliente autenticado coincide con el de la venta
        const clienteToken = req.user?.ide_clie;
        
        if (!clienteToken) {
            console.log('Error: Cliente no autenticado');
            throw new UnauthorizedException('Cliente no autenticado');
        }

        // Verificar que la venta corresponde al cliente autenticado
        if (body.cabeceraVenta?.ideClie !== clienteToken) {
            console.log(`Error: ideClie del body (${body.cabeceraVenta?.ideClie}) != clienteToken (${clienteToken})`);
            throw new BadRequestException('El cliente de la venta no coincide con el usuario autenticado');
        }

        try {
            const result = await this.ventasService.crearVenta(body);
            console.log('Venta creada exitosamente:', result);
            return result;
        } catch (error) {
            console.error('Error al crear venta:', error);
            throw new BadRequestException(error.message || 'Error al procesar la venta');
        }
    }

    /**
     * Obtener historial de compras del cliente autenticado
     * GET /mobile/ventas/historial
     */
    @Get('historial')
    async obtenerHistorial(@Req() req: any) {
        const clienteId = req.user?.ide_clie;
        
        if (!clienteId) {
            throw new UnauthorizedException('Cliente no autenticado');
        }

        return this.ventasService.obtenerHistorialCliente(clienteId);
    }

    /**
     * Obtener detalle de una venta específica
     * GET /mobile/ventas/:id
     */
    @Get(':id')
    async obtenerDetalle(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
        const clienteId = req.user?.ide_clie;
        
        if (!clienteId) {
            throw new UnauthorizedException('Cliente no autenticado');
        }

        try {
            return await this.ventasService.obtenerDetalleVenta(id, clienteId);
        } catch (error) {
            throw new BadRequestException(error.message || 'Error al obtener la venta');
        }
    }
}
