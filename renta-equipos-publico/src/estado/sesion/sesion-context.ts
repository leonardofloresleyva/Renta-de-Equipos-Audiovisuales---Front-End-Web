import { createContext } from 'react';
import type { UsuarioSesion, DatosRegistro } from '../../tipos';

export interface ValorSesion {
    usuario: UsuarioSesion | null;
    perfilId: number | null;
    entrar: (correo: string, password: string) => Promise<void>;
    registrar: (datos: DatosRegistro) => Promise<void>;
    salir: () => void;
}

export const SesionContext = createContext<ValorSesion | null>(null);
