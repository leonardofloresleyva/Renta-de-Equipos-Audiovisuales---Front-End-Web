import type { Sesion } from '../tipos.ts';

const CLAVE_SESION = 'renta-av.sesion';

export function leerSesion(): Sesion | null {
  const guardado = localStorage.getItem(CLAVE_SESION);
  if (!guardado) return null;

  try {
    const sesion = JSON.parse(guardado) as Sesion;

    const esValida =
      typeof sesion.token === 'string' &&
      typeof sesion.perfilId === 'number' &&
      typeof sesion.expiraEn === 'number' &&
      typeof sesion.usuario?.correo === 'string' &&
      typeof sesion.usuario?.nombre === 'string' &&
      typeof sesion.usuario?.rol === 'string';

    if (!esValida || sesion.expiraEn <= Date.now()) {
      borrarSesion();
      return null;
    }

    return sesion;
  } catch {
    borrarSesion();
    return null;
  }
}

export function guardarSesion(sesion: Sesion): void {
  localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
}

export function borrarSesion(): void {
  localStorage.removeItem(CLAVE_SESION);
}

export function leerToken(): string | null {
  return leerSesion()?.token ?? null;
}
