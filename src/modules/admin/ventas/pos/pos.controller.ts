import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  PermissionGuard,
  RequirePermission,
} from 'src/modules/auth/authorization';
import { ConfirmarVentaPosDto } from './dto/confirmar_venta_pos.dto';
import { PosService } from './pos.service';

const RUTA_POS = '/admin/ventas/pos';

@UseGuards(AuthGuard('jwt'), PermissionGuard)
@Controller('ventas/pos')
export class PosController {
  constructor(private readonly posService: PosService) {}

  @RequirePermission(RUTA_POS, 'listar')
  @Get('producto/codigo/:codigo')
  async buscarProductoPorCodigo(@Param('codigo') codigo: string) {
    return this.posService.buscarProductoPorCodigo(codigo);
  }

  @RequirePermission(RUTA_POS, 'listar')
  @Get('cliente/cedula/:cedula')
  async buscarClientePorCedula(@Param('cedula') cedula: string) {
    return this.posService.buscarClientePorCedula(cedula);
  }

  @RequirePermission(RUTA_POS, 'insertar')
  @Post('confirmar')
  async confirmarVenta(@Body() body: ConfirmarVentaPosDto, @Req() req: any) {
    return this.posService.confirmarVenta(body, req.user);
  }

  @RequirePermission(RUTA_POS, 'modificar')
  @Post('cancelar/:ideVent')
  async cancelarVenta(@Param('ideVent', ParseIntPipe) ideVent: number) {
    return this.posService.cancelarVenta(ideVent);
  }
}
