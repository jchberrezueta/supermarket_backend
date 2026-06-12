import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

interface PosScanSession {
  sessionId: string;
  scannerToken: string;
  createdAt: Date;
  expiresAt: Date;
  active: boolean;
}

@Injectable()
export class PosScanService {
  private readonly sessions = new Map<string, PosScanSession>();
  private readonly sessionDurationMs = 2 * 60 * 60 * 1000; // 2 horas

  createSession() {
    const sessionId = `POS-${randomUUID()}`;
    const scannerToken = randomUUID();

    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.sessionDurationMs);

    const session: PosScanSession = {
      sessionId,
      scannerToken,
      createdAt: now,
      expiresAt,
      active: true,
    };

    this.sessions.set(sessionId, session);

    return session;
  }

  getSession(sessionId: string): PosScanSession {
    const session = this.sessions.get(sessionId);

    if (!session) {
      throw new NotFoundException('La sesión POS no existe.');
    }

    if (!session.active) {
      throw new BadRequestException('La sesión POS ya no está activa.');
    }

    if (session.expiresAt.getTime() < Date.now()) {
      session.active = false;
      throw new BadRequestException('La sesión POS ha expirado.');
    }

    return session;
  }

  validateScannerToken(
    sessionId: string,
    scannerToken: string,
  ): PosScanSession {
    const session = this.getSession(sessionId);

    if (session.scannerToken !== scannerToken) {
      throw new BadRequestException(
        'El escáner móvil no está autorizado para esta sesión POS.',
      );
    }

    return session;
  }

  closeSession(sessionId: string) {
    const session = this.getSession(sessionId);

    session.active = false;

    return session;
  }

  normalizeCodigo(codigo: string): string {
    const normalized = codigo.trim();

    if (!normalized) {
      throw new BadRequestException(
        'El código escaneado no puede estar vacío.',
      );
    }

    return normalized;
  }
}
