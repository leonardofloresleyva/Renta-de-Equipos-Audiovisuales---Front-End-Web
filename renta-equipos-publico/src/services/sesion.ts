import { api, type Sobre } from './api.ts';
import type { DatosRegistro, PayloadJwt, RespuestaToken, Sesion } from '../tipos.ts';

// El JWT viene firmado, no cifrado: se puede leer, pero no modificar.
function decodificarPayload(token: string): PayloadJwt | null {
  try {
    const parte = token.split('.')[1];
    if (!parte) return null;

    const normalizado = parte.replace(/-/g, '+').replace(/_/g, '/');
    const resto = normalizado.length % 4;
    const conRelleno =
      resto === 0 ? normalizado : normalizado + '='.repeat(4 - resto);

    const binario = atob(conRelleno);
    const json = decodeURIComponent(
      binario
        .split('')
        .map((caracter) => `%${caracter.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join(''),
    );

    return JSON.parse(json) as PayloadJwt;
  } catch {
    return null;
  }
}

function construirSesion(respuesta: RespuestaToken): Sesion {
  const payload = decodificarPayload(respuesta.access_token);

  if (!payload || typeof payload.perfilId !== 'number') {
    throw new Error('La respuesta de autenticación no contiene un token válido.');
  }

  return {
    token: respuesta.access_token,
    usuario: respuesta.usuario,
    perfilId: payload.perfilId,
    expiraEn: Date.now() + respuesta.expires_in * 1000,
  };
}

export async function entrar(correo: string, password: string): Promise<Sesion> {
  const respuesta = await api.post<Sobre<RespuestaToken>>('/auth/login', {
    correo,
    password,
  });
  return construirSesion(respuesta.data.data);
}

export async function registrar(datos: DatosRegistro): Promise<Sesion> {
  const respuesta = await api.post<Sobre<RespuestaToken>>('/auth/registro', datos);
  return construirSesion(respuesta.data.data);
}
