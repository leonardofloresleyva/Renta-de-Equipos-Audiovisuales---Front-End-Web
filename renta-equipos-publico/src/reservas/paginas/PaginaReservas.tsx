import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { formatoPrecio } from '../../utils/formato.precio.ts';
import { useReservas } from '../../estado/global/reservas.ts';
import type { Reserva } from '../../tipos.ts';
import '../styles/reservas.css';
import { claseEstado, etiquetaEstado, formatearFecha, formatearFechaCreacion } from '../formato-reserva.ts';

type FiltroReserva = 'Todas' | 'En curso' | 'Confirmadas' | 'Finalizadas' | 'Canceladas';
type VistaReserva = 'tabla' | 'tarjetas';

const FILTROS: readonly FiltroReserva[] = [
  'Todas',
  'En curso',
  'Confirmadas',
  'Finalizadas',
  'Canceladas',
];

function coincideFiltro(reserva: Reserva, filtro: FiltroReserva): boolean {
  if (filtro === 'Todas') return true;
  if (filtro === 'En curso') return reserva.estado === 'entregada';
  if (filtro === 'Confirmadas') return reserva.estado === 'apartada';
  if (filtro === 'Finalizadas') return reserva.estado === 'devuelta';
  return reserva.estado === 'cancelada';
}

export default function PaginaReservas() {
  const { lista: reservas, cargando, error, cargar } = useReservas();
  const [filtro, setFiltro] = useState<FiltroReserva>('Todas');
  const [vista, setVista] = useState<VistaReserva>('tabla');
  const filtradas = useMemo(
    () => reservas.filter((reserva) => coincideFiltro(reserva, filtro)),
    [reservas, filtro],
  );

  if (cargando) {
    return (
      <section className="reservas panel">
        <div className="reservas__vacio" role="status" aria-live="polite">
          Cargando tus reservas…
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="reservas panel">
        <div className="reservas__vacio" role="alert">
          <h2>No se pudieron cargar tus reservas</h2>
          <p>{error}</p>
          <button className="boton" type="button" onClick={cargar}>Reintentar</button>
        </div>
      </section>
    );
  }

  if (!reservas.length) {
    return (
      <section className="reservas panel">
        <div className="reservas__vacio">
          <h2>Aún no tienes reservas</h2>
          <p>Explora el catálogo y arma tu lista de renta para crear la primera.</p>
          <Link className="boton" to="/catalogo">Ir al catálogo</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="reservas panel">
      <header className="reservas__encabezado">
        <div>
          <div className="reservas__titulo-linea">
            <h1>Mis reservas</h1>
            <span className="reservas__contador">{reservas.length} registros</span>
          </div>
          <p>Historial y seguimiento de tus solicitudes de renta audiovisual. Haz clic en una reserva para ver su desglose.</p>
        </div>
        <div className="reservas__controles">
          <div className="selector-segmentado" role="group" aria-label="Filtrar reservas">
            {FILTROS.map((opcion) => (
              <button
                className={filtro === opcion ? 'selector-segmentado__opcion selector-segmentado__opcion--activa' : 'selector-segmentado__opcion'}
                key={opcion}
                type="button"
                aria-pressed={filtro === opcion}
                onClick={() => setFiltro(opcion)}
              >
                {opcion}
              </button>
            ))}
          </div>
          <div className="selector-segmentado selector-segmentado--vista" role="group" aria-label="Cambiar vista">
            <button
              className={vista === 'tabla' ? 'selector-segmentado__opcion selector-segmentado__opcion--activa' : 'selector-segmentado__opcion'}
              type="button"
              aria-pressed={vista === 'tabla'}
              onClick={() => setVista('tabla')}
            >
              ▤ <span>Tabla</span>
            </button>
            <button
              className={vista === 'tarjetas' ? 'selector-segmentado__opcion selector-segmentado__opcion--activa' : 'selector-segmentado__opcion'}
              type="button"
              aria-pressed={vista === 'tarjetas'}
              onClick={() => setVista('tarjetas')}
            >
              ⠿ <span>Tarjetas</span>
            </button>
          </div>
        </div>
      </header>

      {filtradas.length === 0 ? (
        <div className="reservas__vacio">
          <h2>No hay reservas en esta categoría</h2>
          <p>Elige otro filtro para consultar tu historial.</p>
          <button className="boton" type="button" onClick={() => setFiltro('Todas')}>
            Ver todas
          </button>
        </div>
      ) : vista === 'tabla' ? (
        <div className="reservas__tabla-contenedor">
          <table className="reservas__tabla">
            <thead>
              <tr>
                <th scope="col">Folio</th>
                <th scope="col">Fecha inicio</th>
                <th scope="col">Fecha fin</th>
                <th scope="col">Fecha creación</th>
                <th scope="col">Total</th>
                <th scope="col">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.map((reserva) => (
                <tr key={reserva.id}>
                  <td>
                    <Link className="reserva-folio" to={`/reservas/${reserva.id}`}>
                      <strong>#{reserva.folio}</strong>
                      <span>Ver detalle →</span>
                    </Link>
                  </td>
                  <td>{formatearFecha(reserva.fechaEntrega)}</td>
                  <td>{formatearFecha(reserva.fechaRecoleccion)}</td>
                  <td className="reservas__fecha-creacion">{formatearFechaCreacion(reserva.creadoEn)}</td>
                  <td><strong>{formatoPrecio(reserva.montoTotal)}</strong></td>
                  <td><span className={claseEstado(reserva.estado)}>{etiquetaEstado(reserva.estado)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="reservas__rejilla">
          {filtradas.map((reserva) => (
            <Link className="reserva-tarjeta" key={reserva.id} to={`/reservas/${reserva.id}`}>
              <div className="reserva-tarjeta__encabezado">
                <strong>#{reserva.folio}</strong>
                <span className={claseEstado(reserva.estado)}>{etiquetaEstado(reserva.estado)}</span>
              </div>
              <p>{formatearFecha(reserva.fechaEntrega)} – {formatearFecha(reserva.fechaRecoleccion)}</p>
              <div className="reserva-tarjeta__pie">
                <span>{formatoPrecio(reserva.montoTotal)}</span>
                <span>{formatearFechaCreacion(reserva.creadoEn)}</span>
              </div>
              <span className="reserva-tarjeta__link">Ver detalle →</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
