import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { formatoPrecio } from '../catalogo/articulos-demo.ts';
import { NoEncontrado } from '../componentes/NoEncontrado.tsx';
import { fechaReserva, diasDeReserva, subtotalReserva, type EstadoReserva } from './reservas-demo.ts';
import { useReservas } from './useReservas.ts';

function estadoClase(estado: EstadoReserva): string {
  if (estado === 'Apartada') return 'reserva-estado reserva-estado--apartada';
  if (estado === 'En curso') return 'reserva-estado reserva-estado--curso';
  if (estado === 'Cancelación solicitada') return 'reserva-estado reserva-estado--solicitud';
  return 'reserva-estado reserva-estado--finalizada';
}

export default function PaginaReserva() {
  const { id } = useParams();
  const { reservas, solicitarCancelacion } = useReservas();
  const reserva = reservas.find((item) => item.id === id);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [motivo, setMotivo] = useState('');
  const [aviso, setAviso] = useState('');

  if (!reserva) return <NoEncontrado />;

  const reservaActual = reserva;
  const dias = diasDeReserva(reservaActual);
  const subtotal = subtotalReserva(reservaActual);
  const puedeCancelar = reservaActual.estado === 'Apartada' || reservaActual.estado === 'En curso';

  function enviarSolicitud() {
    solicitarCancelacion(reservaActual.id, motivo.trim());
    setModalAbierto(false);
    setMotivo('');
    setAviso('Tu solicitud de cancelación quedó registrada en esta demostración.');
    window.setTimeout(() => setAviso(''), 3500);
  }

  return (
    <>
      <article className="reserva-detalle panel">
        <header className="reserva-detalle__encabezado">
          <div className="reserva-detalle__titulo">
            <Link to="/reservas" className="reserva-detalle__volver">← Volver a mis reservas</Link>
            <h1>Reserva (#{reservaActual.id})</h1>
          </div>
          <span className={estadoClase(reservaActual.estado)}>{reservaActual.estado}</span>
        </header>

        <div className="reserva-detalle__columnas">
          <section className="reserva-resumen" aria-labelledby="reserva-detalle-titulo">
            <h2 id="reserva-detalle-titulo">Detalle</h2>
            <div className="reserva-resumen__periodo">
              <span className="reserva-resumen__label">Periodo</span>
              <div className="reserva-resumen__fechas">
                <time dateTime={reservaActual.fechaInicio}>{fechaReserva(reservaActual.fechaInicio)}</time>
                <span aria-hidden="true">→</span>
                <time dateTime={reservaActual.fechaFin}>{fechaReserva(reservaActual.fechaFin)}</time>
              </div>
            </div>
            <dl className="reserva-resumen__lista">
              <div><dt>Cantidad de artículos</dt><dd>{reservaActual.articulos.length}</dd></div>
              <div><dt>Cantidad de piezas</dt><dd>{reservaActual.articulos.reduce((total, item) => total + item.cantidad, 0)}</dd></div>
              <div><dt>Días de renta</dt><dd>{dias}</dd></div>
            </dl>
            <dl className="reserva-resumen__totales">
              <div><dt>Monto total de artículos</dt><dd>{formatoPrecio(subtotal)}</dd></div>
              <div><dt>Depósito de garantía</dt><dd>{formatoPrecio(reservaActual.deposito)}</dd></div>
              <div className="reserva-resumen__total"><dt>Total</dt><dd>{formatoPrecio(subtotal + reservaActual.deposito)}</dd></div>
            </dl>
            <div className="reserva-resumen__estado">
              <span>Estado</span>
              <span className={estadoClase(reservaActual.estado)}>{reservaActual.estado}</span>
            </div>
            {reservaActual.estado === 'Cancelación solicitada' && (
              <p className="reserva-resumen__nota">
                Tu solicitud está pendiente de revisión{reservaActual.motivoCancelacion ? `: ${reservaActual.motivoCancelacion}` : '.'}
              </p>
            )}
            {puedeCancelar && (
              <button className="boton-cancelar" type="button" onClick={() => setModalAbierto(true)}>
                Solicitar cancelación
              </button>
            )}
          </section>

          <section className="reserva-articulos" aria-labelledby="reserva-articulos-titulo">
            <header className="reserva-articulos__encabezado">
              <h2 id="reserva-articulos-titulo">Artículos reservados</h2>
              <span>{reservaActual.articulos.length} {reservaActual.articulos.length === 1 ? 'artículo' : 'artículos'}</span>
            </header>
            <div className="reserva-articulos__lista">
              {reservaActual.articulos.map((articulo) => (
                <article className="articulo-reservado" key={articulo.nombre}>
                  <img src={articulo.imagen} alt="" />
                  <div className="articulo-reservado__datos">
                    <h3>{articulo.nombre}</h3>
                    <p>{formatoPrecio(articulo.precioPorDia)} / día</p>
                    <span>{articulo.cantidad} {articulo.cantidad === 1 ? 'pieza' : 'piezas'}</span>
                  </div>
                  <div className="articulo-reservado__subtotal">
                    <span>Subtotal</span>
                    <strong>{formatoPrecio(articulo.precioPorDia * articulo.cantidad * dias)}</strong>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
        <p className="reservas__nota">Maqueta de demostración: los cambios no se envían a ningún servicio.</p>
      </article>

      {aviso && <div className="toast" role="status">{aviso}</div>}
      {modalAbierto && (
        <div
          className="reserva-modal__fondo"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setModalAbierto(false);
          }}
        >
          <section className="reserva-modal" role="dialog" aria-modal="true" aria-labelledby="reserva-modal-titulo">
            <div className="reserva-modal__icono" aria-hidden="true">!</div>
            <div className="reserva-modal__contenido">
              <h2 id="reserva-modal-titulo">Solicitar cancelación de reserva</h2>
              <p>¿Estás seguro de que deseas enviar una solicitud de cancelación para la reserva               <strong>#{reservaActual.id}</strong>?</p>
              <label className="reserva-modal__campo">
                <span>Motivo de la solicitud (opcional)</span>
                <textarea
                  value={motivo}
                  onChange={(event) => setMotivo(event.target.value)}
                  placeholder="Ej. Cambio de fechas de rodaje o ajuste de producción..."
                  rows={3}
                />
              </label>
              <div className="reserva-modal__acciones">
                <button className="boton boton--secundario" type="button" onClick={() => setModalAbierto(false)}>No, conservar</button>
                <button className="boton boton--peligro" type="button" onClick={enviarSolicitud}>Sí, enviar solicitud</button>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
