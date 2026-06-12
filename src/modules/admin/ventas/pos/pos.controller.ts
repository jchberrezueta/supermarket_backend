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
import { Roles } from 'src/modules/auth/roles.decorator';
import { RolesGuard } from 'src/modules/auth/roles.guard';
import { ConfirmarVentaPosDto } from './dto/confirmar_venta_pos.dto';
import { PosService } from './pos.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('padmin', 'pventas')
@Controller('ventas/pos')
export class PosController {
  constructor(private readonly posService: PosService) {}

  @Get('producto/codigo/:codigo')
  async buscarProductoPorCodigo(@Param('codigo') codigo: string) {
    return this.posService.buscarProductoPorCodigo(codigo);
  }

  @Get('cliente/cedula/:cedula')
  async buscarClientePorCedula(@Param('cedula') cedula: string) {
    return this.posService.buscarClientePorCedula(cedula);
  }

  @Post('confirmar')
  async confirmarVenta(@Body() body: ConfirmarVentaPosDto, @Req() req: any) {
    return this.posService.confirmarVenta(body, req.user);
  }

  @Post('cancelar/:ideVent')
  async cancelarVenta(@Param('ideVent', ParseIntPipe) ideVent: number) {
    return this.posService.cancelarVenta(ideVent);
  }
}
