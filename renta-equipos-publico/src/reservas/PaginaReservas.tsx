import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { formatoPrecio } from '../catalogo/articulos-demo.ts';
import { NoEncontrado } from '../componentes/NoEncontrado.tsx';
import { fechaReserva, subtotalReserva, type EstadoReserva, type ReservaDemo } from './reservas-demo.ts';
import { useReservas } from './useReservas.ts';

type FiltroReserva = 'Todas' | 'En Curso' | 'Confirmadas' | 'Finalizadas';
type VistaReserva = 'tabla' | 'tarjetas';

function estadoClase(estado: EstadoReserva): string {
  if (estado === 'Apartada') return 'reserva-estado reserva-estado--apartada';
  if (estado === 'En curso') return 'reserva-estado reserva-estado--curso';
  if (estado === 'Cancelación solicitada') return 'reserva-estado reserva-estado--solicitud';
  return 'reserva-estado reserva-estado--finalizada';
}

function coincideFiltro(reserva: ReservaDemo, filtro: FiltroReserva): boolean {
  if (filtro === 'Todas') return true;
  if (filtro === 'En Curso') return reserva.estado === 'En curso';
  if (filtro === 'Confirmadas') {
    return reserva.estado === 'Apartada' || reserva.estado === 'Cancelación solicitada';
  }
  return reserva.estado === 'Finalizada';
}

export default function PaginaReservas() {
  const { reservas } = useReservas();
  const [filtro, setFiltro] = useState<FiltroReserva>('Todas');
  const [vista, setVista] = useState<VistaReserva>('tabla');
  const filtradas = useMemo(
    () => reservas.filter((reserva) => coincideFiltro(reserva, filtro)),
    [reservas, filtro],
  );

  if (!reservas.length) return <NoEncontrado />;

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
            {(['Todas', 'En Curso', 'Confirmadas', 'Finalizadas'] as const).map((opcion) => (
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
                      <strong>#{reserva.id}</strong>
                      <span>Ver detalle →</span>
                    </Link>
                  </td>
                  <td>{fechaReserva(reserva.fechaInicio)}</td>
                  <td>{fechaReserva(reserva.fechaFin)}</td>
                  <td className="reservas__fecha-creacion">{fechaReserva(reserva.fechaCreacion)}</td>
                  <td><strong>{formatoPrecio(subtotalReserva(reserva))}</strong></td>
                  <td><span className={estadoClase(reserva.estado)}>{reserva.estado}</span></td>
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
                <strong>#{reserva.id}</strong>
                <span className={estadoClase(reserva.estado)}>{reserva.estado}</span>
              </div>
              <p>{fechaReserva(reserva.fechaInicio)} – {fechaReserva(reserva.fechaFin)}</p>
              <div className="reserva-tarjeta__pie">
                <span>{reserva.articulos.length} {reserva.articulos.length === 1 ? 'artículo' : 'artículos'}</span>
                <strong>{formatoPrecio(subtotalReserva(reserva))}</strong>
              </div>
              <span className="reserva-tarjeta__link">Ver detalle →</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
