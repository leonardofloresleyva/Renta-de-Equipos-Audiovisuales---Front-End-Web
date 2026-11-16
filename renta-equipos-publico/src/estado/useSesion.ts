import { useContext } from 'react';
import { SesionContext } from './sesion-context.ts';

export function useSesion() {
    const contexto = useContext(SesionContext);
    if (!contexto) {
        throw new Error('useSesion debe usarse dentro de ProveedorSesion.');
    }
    return contexto;
}
