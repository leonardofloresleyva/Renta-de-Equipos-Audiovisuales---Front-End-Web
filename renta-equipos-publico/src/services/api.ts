import axios from 'axios';
import { borrarSesion, leerToken } from './almacen-sesion.ts';

export const URL_API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export const api = axios.create({
  baseURL: URL_API,
  timeout: 5000, // si en 5 s no responde, es error
});

export interface Sobre<T> {
  data: T;
}

interface ErrorApi {
  statusCode?: number;
  error?: string;
  message?: string | string[];
}

export function urlImagen(ruta: string): string {
  return `${URL_API}${ruta}`;
}

function esRutaDeAuth(url: string | undefined): boolean {
  return !!url && (url.includes('/auth/login') || url.includes('/auth/registro'));
}

// El mensaje que se le enseña a la persona cuando algo falla.
export function mensajeDeError(error: unknown, generico: string): string {
  if (!axios.isAxiosError(error)) return generico;

  if (!error.response) {
    return 'No pudimos conectar con el servicio. Revisa tu conexión e inténtalo de nuevo.';
  }

  const { status, data } = error.response;
  const detalle = data as ErrorApi | undefined;
  const mensaje = detalle?.message;

  if (status === 401) {
    if (error.config?.url?.includes('/auth/login')) {
      return 'Correo o contraseña incorrectos.';
    }
    if (!esRutaDeAuth(error.config?.url)) {
      return 'Tu sesión terminó. Vuelve a entrar.';
    }
  }

  if (status === 403) {
    return 'No tienes permiso para realizar esta acción.';
  }

  if (status === 409) {
    const texto = Array.isArray(mensaje) ? mensaje.join(' ') : mensaje;
    if (typeof texto === 'string' && /registrad|existe/i.test(texto)) {
      return 'Ese correo ya tiene una cuenta. Inicia sesión.';
    }
  }

  if (status >= 500) {
    return 'El servicio no está disponible en este momento. Inténtalo más tarde.';
  }

  // 400 de validación: el backend devuelve un arreglo de mensajes.
  if (Array.isArray(mensaje)) return mensaje.join('. ');
  if (typeof mensaje === 'string') return mensaje;

  return generico;
}

api.interceptors.request.use((config) => {
  const token = leerToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      !esRutaDeAuth(error.config?.url) &&
      leerToken()
    ) {
      borrarSesion();
      window.dispatchEvent(new Event('sesion-terminada'));
    }
    return Promise.reject(error);
  },
);
