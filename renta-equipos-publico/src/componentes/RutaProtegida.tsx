import { Navigate, Outlet, useLocation } from 'react-router';
import { useSesion } from '../estado/sesion/useSesion';

export function RutaProtegida() {
  const { usuario } = useSesion();
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

  return <Outlet />;
}
