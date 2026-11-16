import { createContext } from 'react';
import type { DatosRegistro, UsuarioSesion } from '../tipos.ts';

export interface ValorSesion {
    usuario: UsuarioSesion | null;
    perfilId: number | null;
    entrar: (correo: string, password: string) => Promise<void>;
    registrar: (datos: DatosRegistro) => Promise<void>;
    salir: () => void;
}

export const SesionContext = createContext<ValorSesion | null>(null);
