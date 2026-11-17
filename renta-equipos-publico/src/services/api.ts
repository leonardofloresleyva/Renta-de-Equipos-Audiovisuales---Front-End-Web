import axios from 'axios';
import { obtenerToken } from './sesion.ts';

export const URL_API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export const api = axios.create({
  baseURL: URL_API,
  timeout: 5000, // si en 5 s no responde, es error
});

api.interceptors.request.use((config) => {
  const token = obtenerToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export interface Sobre<T> {
  data: T;
}

export function urlImagen(ruta: string): string {
  return `${URL_API}${ruta}`;
}