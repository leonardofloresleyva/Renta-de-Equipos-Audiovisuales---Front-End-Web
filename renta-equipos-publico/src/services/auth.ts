import { api, type Sobre } from './api.ts';
import { guardarSesion, type TokenAutenticacion } from './sesion.ts';

export async function iniciarSesion(correo: string, password: string): Promise<TokenAutenticacion> {
  const respuesta = await api.post<Sobre<TokenAutenticacion>>('/auth/login', { correo, password });
  guardarSesion(respuesta.data.data);
  return respuesta.data.data;
}
