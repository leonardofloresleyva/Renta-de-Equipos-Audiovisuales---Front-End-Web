import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router';
import { formatoPrecio } from '../../utils/formato.precio.ts';
import { urlImagen } from '../../services/api.ts';
import { useReservas } from '../../estado/global/reservas.ts';
import '../styles/reservas.css';
import { claseEstado, diasDeReserva, etiquetaEstado, formatearFecha, formatearFechaCreacion } from '../formato-reserva.ts';
import { useDetalleReserva } from '../hooks/useDetalleReserva.ts';

function ReservaNoEncontrada() {
  return (
    <section className="vacio">
      <div className="vacio__codigo">404</div>
      <h1>No encontramos esa reserva</h1>
      <p>Revisa la dirección o vuelve a tu historial de reservas.</p>
      <Link to="/reservas" className="boton">Volver a mis reservas</Link>
    </section>
  );
}

export default function PaginaReserva() {
  const { id } = useParams();
  const idReserva = Number(id);
  const idValido = Number.isSafeInteger(idReserva) && idReserva > 0;

  const {
    lista: reservas,
    cargando: cargandoLista,
    error: errorLista,
    cargar,
  } = useReservas();

  const reserva = reservas.find((item) => item.id === idReserva);

  const {
    articulos,
    garantia,
    catalogo,
    cargando: cargandoDetalle,
    error: errorDetalle,
    reintentar,
  } = useDetalleReserva(idReserva, idValido && Boolean(reserva));

  const catalogoPorId = useMemo(
    () => new Map(catalogo.map((articulo) => [articulo.id, articulo])),
    [catalogo],
  );

  const [modalAbierto, setModalAbierto] = useState(false);
  const [motivo, setMotivo] = useState('');
  const [aviso, setAviso] = useState('');

  if (!idValido) return <ReservaNoEncontrada />;

  if (!reserva && cargandoLista) {
    return <div className="reservas__vacio panel" role="status" aria-live="polite">Cargando la reserva…</div>;
  }

  if (!reserva && errorLista) {
    return (
      <div className="reservas__vacio panel" role="alert">
        <h2>No se pudo cargar la reserva</h2>
        <p>{errorLista}</p>
        <button className="boton" type="button" onClick={cargar}>Reintentar</button>
      </div>
    );
  }

  if (!reserva) return <ReservaNoEncontrada />;

  if (cargandoDetalle) {
    return <div className="reservas__vacio panel" role="status" aria-live="polite">Cargando el detalle de la reserva…</div>;
  }

  if (errorDetalle) {
    return (
      <div className="reservas__vacio panel" role="alert">
        <h2>No se pudo cargar el detalle</h2>
        <p>{errorDetalle}</p>
        <button className="boton" type="button" onClick={reintentar}>Reintentar</button>
      </div>
    );
  }

  const dias = diasDeReserva(reserva);
  const piezas = articulos.reduce((total, articulo) => total + articulo.cantidad, 0);
  const deposito = garantia?.monto ?? 0;
  const total = reserva.montoTotal + deposito;
  const puedeCancelar = reserva.estado === 'apartada' || reserva.estado === 'entregada';

  function enviarSolicitud() {
    setModalAbierto(false);
    setMotivo('');
    setAviso('Tu solicitud de cancelación quedó registrada en modo demostración. Todavía no se envía al servicio.');
    window.setTimeout(() => setAviso(''), 4000);
  }

  return (
    <>
      <article className="reserva-detalle panel">
        <header className="reserva-detalle__encabezado">
          <div className="reserva-detalle__titulo">
            <Link to="/reservas" className="reserva-detalle__volver">← Volver a mis reservas</Link>
            <h1>Reserva #{reserva.folio}</h1>
          </div>
          <span className={claseEstado(reserva.estado)}>{etiquetaEstado(reserva.estado)}</span>
        </header>

        <div className="reserva-detalle__columnas">
          <section className="reserva-resumen" aria-labelledby="reserva-detalle-titulo">
            <h2 id="reserva-detalle-titulo">Detalle</h2>
            <div className="reserva-resumen__periodo">
              <span className="reserva-resumen__label">Periodo</span>
              <div className="reserva-resumen__fechas">
                <time dateTime={reserva.fechaEntrega}>{formatearFecha(reserva.fechaEntrega)}</time>
                <span aria-hidden="true">→</span>
                <time dateTime={reserva.fechaRecoleccion}>{formatearFecha(reserva.fechaRecoleccion)}</time>
              </div>
            </div>
            <dl className="reserva-resumen__lista">
              <div><dt>Cantidad de artículos</dt><dd>{articulos.length}</dd></div>
              <div><dt>Cantidad de piezas</dt><dd>{piezas}</dd></div>
              <div><dt>Días de renta</dt><dd>{dias}</dd></div>
              <div><dt>Creada el</dt><dd>{formatearFechaCreacion(reserva.creadoEn)}</dd></div>
              <div>
                <dt>Entrega</dt>
                <dd>{reserva.calle} {reserva.numero}, {reserva.colonia}</dd>
              </div>
            </dl>
            <dl className="reserva-resumen__totales">
              <div><dt>Monto de artículos</dt><dd>{formatoPrecio(reserva.montoTotal)}</dd></div>
              <div>
                <dt>Depósito de garantía</dt>
                <dd>{garantia ? formatoPrecio(garantia.monto) : 'No registrado'}</dd>
              </div>
              <div className="reserva-resumen__total"><dt>Total</dt><dd>{formatoPrecio(total)}</dd></div>
            </dl>
            <div className="reserva-resumen__estado">
              <span>Estado</span>
              <span className={claseEstado(reserva.estado)}>{etiquetaEstado(reserva.estado)}</span>
            </div>
            {puedeCancelar && (
              <button className="boton-cancelar" type="button" onClick={() => setModalAbierto(true)}>
                Solicitar cancelación
              </button>
            )}
          </section>

          <section className="reserva-articulos" aria-labelledby="reserva-articulos-titulo">
            <header className="reserva-articulos__encabezado">
              <h2 id="reserva-articulos-titulo">Artículos reservados</h2>
              <span>{articulos.length} {articulos.length === 1 ? 'artículo' : 'artículos'}</span>
            </header>
            {articulos.length === 0 ? (
              <div className="reservas__vacio">
                <h2>Esta reserva no tiene artículos registrados</h2>
                <p>Comunícate con el equipo de renta para revisar el detalle.</p>
              </div>
            ) : (
              <div className="reserva-articulos__lista">
                {articulos.map((item) => {
                  const articulo = catalogoPorId.get(item.articuloId);
                  const imagen = articulo?.fotografiasUrl[0];

                  return (
                    <article className="articulo-reservado" key={item.id}>
                      {imagen ? (
                        <img src={urlImagen(imagen)} alt="" />
                      ) : (
                        <div className="articulo-reservado__sin-imagen" aria-hidden="true" />
                      )}
                      <div className="articulo-reservado__datos">
                        <h3>{articulo?.nombre ?? `Artículo #${item.articuloId}`}</h3>
                        <p>{formatoPrecio(item.precioUnitario)} / día</p>
                        <span>{item.cantidad} {item.cantidad === 1 ? 'pieza' : 'piezas'}</span>
                      </div>
                      <div className="articulo-reservado__subtotal">
                        <span>Subtotal</span>
                        <strong>{formatoPrecio(item.subtotal)}</strong>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
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
              <p>
                ¿Estás seguro de que deseas enviar una solicitud de cancelación para la reserva
                <strong> #{reserva.folio}</strong>? Esta acción es una demostración: todavía no se
                envía nada al servicio.
              </p>
              <label className="reserva-modal__campo">
                <span>Motivo de la solicitud (opcional)</span>
                <textarea
                  value={motivo}
                  onChange={(event) => setMotivo(event.target.value)}
                  placeholder="Ej. Cambio de fechas del evento o ajuste de producción..."
                  rows={3}
                />
              </label>
              <div className="reserva-modal__acciones">
                <button className="boton boton--secundario" type="button" onClick={() => setModalAbierto(false)}>
                  No, conservar
                </button>
                <button className="boton boton--peligro" type="button" onClick={enviarSolicitud}>
                  Sí, enviar solicitud
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
