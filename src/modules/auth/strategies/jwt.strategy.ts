import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    const jwtSecret = configService.get<string>('JWT_SECRET')?.trim();

    if (!jwtSecret) {
      throw new Error('La variable JWT_SECRET es obligatoria');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any) {
    if (payload?.purpose) {
      throw new UnauthorizedException(
        'El token no es válido para acceder al sistema',
      );
    }

    if (payload?.tokenType !== 'admin') {
      throw new UnauthorizedException(
        'El token no pertenece a la aplicación administrativa',
      );
    }

    if (
      payload?.sub === null ||
      payload?.sub === undefined ||
      !Number.isInteger(Number(payload.sub)) ||
      Number(payload.sub) < 0
    ) {
      throw new UnauthorizedException('Token de acceso inválido');
    }

    return payload;
  }
}
