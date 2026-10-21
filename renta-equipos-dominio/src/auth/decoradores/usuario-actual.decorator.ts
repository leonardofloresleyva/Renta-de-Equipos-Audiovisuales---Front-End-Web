// NUEVO (Paso 2): un decorador de PARAMETRO propio, como @Body o @Param.
// Evita escribir @Req() req y luego req.user (que ademas viene sin tipo).
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PayloadJwt } from '../dominio/payload.jwt';

export const UsuarioActual = createParamDecorator(
  (_dato: unknown, contexto: ExecutionContext): PayloadJwt => {
    const req = contexto.switchToHttp().getRequest<{ user: PayloadJwt }>();
    return req.user; // lo dejo ahi el validate() de la JwtStrategy
  },
);
