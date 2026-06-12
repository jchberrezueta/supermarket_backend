import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/modules/auth/roles.decorator';
import { RolesGuard } from 'src/modules/auth/roles.guard';
import { EnviarCodigoScanDto } from './dto/enviar_codigo_scan.dto';
import { PosScanGateway } from './pos-scan.gateway';
import { PosScanService } from './pos-scan.service';

@Controller('ventas/pos/scan')
export class PosScanController {
  constructor(
    private readonly posScanService: PosScanService,
    private readonly posScanGateway: PosScanGateway,
  ) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('padmin', 'pventas')
  @Post('session')
  createSession(@Req() req: any) {
    const session = this.posScanService.createSession();

    return {
      data: {
        sessionId: session.sessionId,
        scannerToken: session.scannerToken,
        createdAt: session.createdAt,
        expiresAt: session.expiresAt,
        createdBy: {
          userId: req.user?.sub,
          username: req.user?.username,
          perfil: req.user?.perfil,
        },
      },
      response: {
        success: true,
        message: 'Sesión POS creada correctamente.',
      },
    };
  }

  @Post(':sessionId/producto')
  sendScannedProduct(
    @Param('sessionId') sessionId: string,
    @Body() body: EnviarCodigoScanDto,
  ) {
    this.posScanService.validateScannerToken(sessionId, body.scannerToken);

    const codigo = this.posScanService.normalizeCodigo(body.codigo);

    this.posScanGateway.emitProductoEscaneado({
      sessionId,
      codigo,
      scannedAt: new Date().toISOString(),
      source: 'mobile-scanner',
    });

    return {
      data: {
        sessionId,
        codigo,
      },
      response: {
        success: true,
        message: 'Código enviado al POS correctamente.',
      },
    };
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('padmin', 'pventas')
  @Post(':sessionId/cerrar')
  closeSession(@Param('sessionId') sessionId: string) {
    const session = this.posScanService.closeSession(sessionId);

    return {
      data: {
        sessionId: session.sessionId,
        active: session.active,
      },
      response: {
        success: true,
        message: 'Sesión POS cerrada correctamente.',
      },
    };
  }
}
