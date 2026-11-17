import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PayloadJwt } from './dominio/payload.jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  validate(payload: PayloadJwt): PayloadJwt {
    if (
      !payload ||
      !Number.isInteger(payload.sub) ||
      payload.sub <= 0 ||
      !Number.isInteger(payload.perfilId) ||
      payload.perfilId <= 0
    ) {
      throw new UnauthorizedException(
        'Inicia sesión nuevamente para actualizar tu token.',
      );
    }
    return payload;
  }
}
