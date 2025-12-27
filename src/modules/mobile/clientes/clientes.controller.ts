import { Controller, Get, Put, Body, UseGuards, Req, BadRequestException, NotFoundException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MobileClientesService } from './clientes.service';
import { UpdateClienteDto } from './dto';

/**
 * Controller para gestión del perfil del cliente
 * REQUIERE autenticación JWT de cliente
 */
@UseGuards(AuthGuard('jwt'))
@Controller('mobile/clientes')
export class MobileClientesController {

    constructor(private readonly clientesService: MobileClientesService) {}

    /**
     * Obtener perfil del cliente autenticado
     * GET /mobile/clientes/perfil
     */
    @Get('perfil')
    async obtenerPerfil(@Req() req: any) {
        const clienteId = req.user?.ide_clie;
        
        if (!clienteId) {
            throw new BadRequestException('Cliente no identificado');
        }

        const perfil = await this.clientesService.obtenerPerfil(clienteId);
        
        if (!perfil) {
            throw new NotFoundException('Perfil no encontrado');
        }

        return perfil;
    }

    /**
     * Actualizar perfil del cliente autenticado
     * PUT /mobile/clientes/perfil
     */
    @Put('perfil')
    async actualizarPerfil(@Body() body: UpdateClienteDto, @Req() req: any) {
        const clienteId = req.user?.ide_clie;
        
        if (!clienteId) {
            throw new BadRequestException('Cliente no identificado');
        }

        try {
            return await this.clientesService.actualizarPerfil(clienteId, body);
        } catch (error) {
            throw new BadRequestException(error.message || 'Error al actualizar el perfil');
        }
    }
}
