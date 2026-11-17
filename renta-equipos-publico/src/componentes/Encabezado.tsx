import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import { ListaRentaPanel } from './ListaRenta.tsx';
import { useReservas } from '../reservas/useReservas.ts';
import { useCarrito } from '../estado/global/carrito.ts';
import { useSesion } from '../estado/sesion/useSesion.ts';

function claseEnlace({ isActive }: { isActive: boolean }) {
  return isActive ? 'barra__enlace barra__enlace--activo' : 'barra__enlace';
}

export function Encabezado() {
  const { reservas } = useReservas();
  const totalPiezas = useCarrito((state) => state.totalPiezas());
  const { usuario, salir } = useSesion();
  const navegar = useNavigate();
  const [listaAbierta, setListaAbierta] = useState(false);

  function cerrarSesion() {
    salir();
    navegar('/catalogo');
  }

  return (
    <>
      <header className="barra">
        <div className="barra__interior">
          <Link to="/catalogo" className="barra__marca" aria-label="Renta AV, ir al catálogo">
            <span className="barra__marca-icono" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="25" height="25" fill="none">
                <rect x="3" y="6" width="13" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="m16 10 5-3v10l-5-3" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="barra__marca-texto">
              <span className="barra__marca-nombre">Renta <span>AV</span></span>
              <span className="barra__marca-lema">EQUIPO PARA TUS EVENTOS</span>
            </span>
          </Link>

          <span className="barra__separador" aria-hidden="true" />
          <nav className="barra__enlaces" aria-label="Navegación principal">
            <NavLink to="/catalogo" className={claseEnlace}>Catálogo</NavLink>
            <NavLink to="/reservas" className={claseEnlace}>
              Reservas <span className="barra__enlace-contador">{reservas.length}</span>
            </NavLink>
          </nav>

          <div className="barra__sesion">
            <button
              className="boton-lista"
              type="button"
              onClick={() => setListaAbierta(true)}
              aria-label={`Abrir lista de renta, ${totalPiezas} piezas`}
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
                <path d="M3 4h2l2.2 11.1a2 2 0 0 0 2 1.6h8.5a2 2 0 0 0 1.9-1.4L22 8H6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="10" cy="20" r="1.5" fill="currentColor" />
                <circle cx="18" cy="20" r="1.5" fill="currentColor" />
              </svg>
              <span>Lista de renta</span>
              <span className="boton-lista__contador">{totalPiezas}</span>
            </button>
            {usuario ? (
              <>
                <span className="barra__usuario">
                  <svg viewBox="0 0 24 24" width="19" height="19" fill="none" aria-hidden="true">
                    <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.7" />
                    <path d="M5 20c.5-3.1 3.2-5 7-5s6.5 1.9 7 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  </svg>
                  <span className="barra__usuario-nombre">Hola, {usuario.nombre}</span>
                </span>
                <button className="boton-salir" type="button" onClick={cerrarSesion}>Salir</button>
              </>
            ) : (
              <Link to="/login" className="boton-usuario" aria-label="Iniciar sesión">
                <svg viewBox="0 0 24 24" width="21" height="21" fill="none" aria-hidden="true">
                  <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.7" />
                  <path d="M5 20c.5-3.1 3.2-5 7-5s6.5 1.9 7 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </header>
      {listaAbierta && (
        <ListaRentaPanel cerrar={() => setListaAbierta(false)} />
      )}
    </>
  );
}
