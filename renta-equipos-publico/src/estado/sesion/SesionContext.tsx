import { useEffect, useState, type ReactNode } from 'react';
import * as servicio from '../../services/sesion.ts';
import { borrarSesion, guardarSesion, leerSesion } from '../../services/almacen-sesion.ts';
import type { DatosRegistro, Sesion } from '../../tipos.ts';
import { useCarrito } from '../global/carrito.ts';
import { type ValorSesion, SesionContext } from './sesion-context.ts';

export function ProveedorSesion({ children }: { children: ReactNode }) {
    const [sesion, setSesion] = useState<Sesion | null>(leerSesion);
    const { vaciar } = useCarrito();

    async function entrar(correo: string, password: string) {
        const nueva = await servicio.entrar(correo, password);
        guardarSesion(nueva);
        setSesion(nueva);
    }

    async function registrar(datos: DatosRegistro) {
        const nueva = await servicio.registrar(datos);
        guardarSesion(nueva);
        setSesion(nueva);
    }

    function salir() {
        vaciar();
        borrarSesion();
        setSesion(null);
    }

    // El interceptor de api.ts borra el storage y avisa aquí cuando un 401
    // confirma que la sesión ya no sirve.
    useEffect(() => {
        const alTerminar = () => {
            vaciar();
            setSesion(null);
        };
        window.addEventListener('sesion-terminada', alTerminar);
        return () => window.removeEventListener('sesion-terminada', alTerminar);
    }, [vaciar]);

    const valor: ValorSesion = {
        usuario: sesion?.usuario ?? null,
        perfilId: sesion?.perfilId ?? null,
        entrar,
        registrar,
        salir,
    };

    return <SesionContext.Provider value={valor}>{children}</SesionContext.Provider>;
}
