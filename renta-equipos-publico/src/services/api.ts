import axios from 'axios';

export const URL_API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export const api = axios.create({
  baseURL: URL_API,
  timeout: 5000, // si en 5 s no responde, es error
});

export interface Sobre<T> {
  data: T;
}

export function urlImagen(ruta: string): string {
  return `${URL_API}${ruta}`;
}