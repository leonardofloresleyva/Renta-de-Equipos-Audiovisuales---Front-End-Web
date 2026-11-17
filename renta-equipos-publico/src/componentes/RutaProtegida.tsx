import { Link, Navigate, Outlet, useLocation } from 'react-router';
import { useSesion } from '../estado/sesion/useSesion';
import type { Rol } from '../tipos.ts';

interface RutaProtegidaProps {
  roles?: Rol[];
}

export function RutaProtegida({ roles }: RutaProtegidaProps) {
  const { usuario, salir } = useSesion();
  const ubicacion = useLocation();

  if (!usuario) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ desde: `${ubicacion.pathname}${ubicacion.search}` }}
      />
    );
  }

  if (roles && !roles.includes(usuario.rol)) {
    return (
      <section className="vacio">
        <div className="vacio__codigo">Acceso</div>
        <h1>Esta sección es para clientes</h1>
        <p>
          La cuenta de administrador no puede consultar ni agendar reservas desde
          el portal del cliente. Inicia sesión con una cuenta de cliente.
        </p>
        <div className="vacio__acciones">
          <Link to="/catalogo" className="boton">Volver al catálogo</Link>
          <button className="boton boton--secundario" type="button" onClick={salir}>
            Cerrar sesión
          </button>
        </div>
      </section>
    );
  }

  return <Outlet />;
}
