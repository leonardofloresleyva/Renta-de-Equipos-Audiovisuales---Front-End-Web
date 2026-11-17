export type RolUsuario = 'cliente' | 'administrador';

export interface UsuarioSesion {
  correo: string;
  nombre: string;
  rol: RolUsuario;
}

export interface TokenAutenticacion {
  access_token: string;
  token_type: string;
  expires_in: number;
  usuario: UsuarioSesion;
}

interface Sesion extends TokenAutenticacion {
  expiraEn: number;
}

const CLAVE_SESION = 'renta-av-sesion';

function esSesion(valor: unknown): valor is Sesion {
  if (!valor || typeof valor !== 'object') return false;
  const sesion = valor as Partial<Sesion>;
  return typeof sesion.access_token === 'string'
    && typeof sesion.expiraEn === 'number'
    && typeof sesion.expires_in === 'number'
    && typeof sesion.usuario?.correo === 'string'
    && typeof sesion.usuario.nombre === 'string'
    && (sesion.usuario.rol === 'cliente' || sesion.usuario.rol === 'administrador');
}

export function guardarSesion(token: TokenAutenticacion): void {
  const sesion: Sesion = {
    ...token,
    expiraEn: Date.now() + token.expires_in * 1000,
  };
  sessionStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
}

export function obtenerSesion(): Sesion | null {
  const valor = sessionStorage.getItem(CLAVE_SESION);
  if (!valor) return null;

  try {
    const sesion: unknown = JSON.parse(valor);
    if (!esSesion(sesion) || sesion.expiraEn <= Date.now()) {
      cerrarSesion();
      return null;
    }
    return sesion;
  } catch {
    cerrarSesion();
    return null;
  }
}

export function obtenerToken(): string | null {
  return obtenerSesion()?.access_token ?? null;
}

export function esClienteAutenticado(): boolean {
  return obtenerSesion()?.usuario.rol === 'cliente';
}

export function cerrarSesion(): void {
  sessionStorage.removeItem(CLAVE_SESION);
}
