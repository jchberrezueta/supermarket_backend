import { Injectable, Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PosScanService } from './pos-scan.service';

interface JoinPosSessionPayload {
  sessionId: string;
}

interface ProductoEscaneadoPayload {
  sessionId: string;
  codigo: string;
  scannedAt: string;
  source: 'mobile-scanner';
}

@Injectable()
@WebSocketGateway({
  namespace: 'pos-scan',
  cors: {
    origin: '*',
  },
})
export class PosScanGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private readonly server!: Server;

  private readonly logger = new Logger(PosScanGateway.name);

  constructor(private readonly posScanService: PosScanService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado al scanner POS: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado del scanner POS: ${client.id}`);
  }

  @SubscribeMessage('join-pos-session')
  handleJoinPosSession(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: JoinPosSessionPayload,
  ) {
    try {
      const session = this.posScanService.getSession(payload.sessionId);
      const room = this.getRoomName(session.sessionId);

      client.join(room);

      client.emit('pos-session-joined', {
        sessionId: session.sessionId,
        message: 'POS conectado a la sesión de escaneo.',
      });

      this.logger.log(`Cliente ${client.id} unido a ${room}`);
    } catch (error) {
      client.emit('pos-session-error', {
        message:
          error instanceof Error
            ? error.message
            : 'No se pudo unir a la sesión POS.',
      });
    }
  }

  emitProductoEscaneado(payload: ProductoEscaneadoPayload) {
    const room = this.getRoomName(payload.sessionId);

    this.server.to(room).emit('producto-escaneado', {
      codigo: payload.codigo,
      scannedAt: payload.scannedAt,
      source: payload.source,
    });

    this.logger.log(`Producto escaneado emitido a ${room}: ${payload.codigo}`);
  }

  private getRoomName(sessionId: string): string {
    return `pos-session:${sessionId}`;
  }
}
