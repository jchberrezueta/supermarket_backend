import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import { timingSafeEqual } from 'node:crypto';

import { Request } from 'express';

@Injectable()
export class SigIntegrationKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    const expectedKey =
      this.configService.get<string>('integration.sigSyncKey')?.trim() ?? '';

    const providedKey = request.header('x-sig-key')?.trim() ?? '';

    if (!expectedKey || !providedKey) {
      throw new UnauthorizedException(
        'La clave de integración SIG no es válida.',
      );
    }

    const expectedBuffer = Buffer.from(expectedKey);

    const providedBuffer = Buffer.from(providedKey);

    if (expectedBuffer.length !== providedBuffer.length) {
      throw new UnauthorizedException(
        'La clave de integración SIG no es válida.',
      );
    }

    if (!timingSafeEqual(expectedBuffer, providedBuffer)) {
      throw new UnauthorizedException(
        'La clave de integración SIG no es válida.',
      );
    }

    return true;
  }
}
