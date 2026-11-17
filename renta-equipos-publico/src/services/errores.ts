import axios from 'axios';

export function mensajeDeError(error: unknown, predeterminado: string): string {
  if (axios.isAxiosError<{ message?: unknown }>(error)) {
    const mensaje = error.response?.data?.message;
    if (typeof mensaje === 'string') return mensaje;
    if (Array.isArray(mensaje) && mensaje.every((item) => typeof item === 'string')) {
      return mensaje.join('. ');
    }
  }
  return error instanceof Error ? error.message : predeterminado;
}
