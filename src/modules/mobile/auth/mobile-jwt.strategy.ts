import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class MobileJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-mobile',
) {
  constructor(configService: ConfigService) {
    const secret = configService.get<string>('MOBILE_JWT_SECRET')?.trim();

    if (!secret) {
      throw new Error('MOBILE_JWT_SECRET es obligatorio');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    if (payload?.tokenType !== 'customer') {
      throw new UnauthorizedException(
        'El token no pertenece a la aplicación móvil',
      );
    }

    if (
      !Number.isInteger(Number(payload?.ide_clie)) ||
      Number(payload.ide_clie) <= 0
    ) {
      throw new UnauthorizedException('Token móvil inválido');
    }

    return payload;
  }
}
