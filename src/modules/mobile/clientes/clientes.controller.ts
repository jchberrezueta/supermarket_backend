import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IdUtil } from '@common/index';
import { CambiarPasswordDto, UpdateClienteDto } from './dto';
import { MobileClientesService } from './clientes.service';

/**
 * Controller para gestión del perfil del cliente móvil.
 *
 * Requiere JWT de cliente.
 */
@UseGuards(AuthGuard('jwt'))
@Controller('mobile/clientes')
export class MobileClientesController {
  constructor(private readonly clientesService: MobileClientesService) {}

  /**
   * Obtener perfil del cliente autenticado.
   *
   * GET /mobile/clientes/perfil
   */
  @Get('perfil')
  async obtenerPerfil(@Req() req: any) {
    const clienteId = this.obtenerIdClienteDesdeToken(req);

    const perfil = await this.clientesService.obtenerPerfil(clienteId);

    if (!perfil) {
      throw new NotFoundException('Perfil no encontrado.');
    }

    return perfil;
  }

  /**
   * Actualizar perfil del cliente autenticado.
   *
   * PUT /mobile/clientes/perfil
   */
  @Put('perfil')
  async actualizarPerfil(@Body() body: UpdateClienteDto, @Req() req: any) {
    const clienteId = this.obtenerIdClienteDesdeToken(req);

    return this.clientesService.actualizarPerfil(clienteId, body);
  }

  /**
   * Cambiar contraseña del cliente autenticado.
   *
   * POST /mobile/clientes/cambiar-password
   */
  @Post('cambiar-password')
  async cambiarPassword(@Body() body: CambiarPasswordDto, @Req() req: any) {
    const clienteId = this.obtenerIdClienteDesdeToken(req);

    try {
      return await this.clientesService.cambiarPassword(clienteId, body);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw error;
    }
  }

  private obtenerIdClienteDesdeToken(req: any): number {
    return IdUtil.requireId(
      req.user?.ide_clie,
      'No se pudo obtener el ID del cliente autenticado.',
    );
  }
}
