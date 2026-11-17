import { useState } from 'react';
import { useCarrito } from '../estado/global/carrito.ts';
import { urlImagen } from '../services/api.ts';
import { formatoPrecio } from '../utils/formato.precio.ts';
import { useSesion } from '../estado/sesion/useSesion.ts';
import { useNavigate } from 'react-router';

export function ListaRentaPanel({ cerrar }: { cerrar: () => void }) {
  const [fechaMinima] = useState(() => {
    const hoy = new Date();
    return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
  });
  const lista = useCarrito((state) => state.lista);
  const quitar = useCarrito((state) => state.quitar);
  const fechaEntrega = useCarrito((state) => state.fechaEntrega);
  const fechaRecoleccion = useCarrito((state) => state.fechaRecoleccion);
  const actualizarPeriodo = useCarrito((state) => state.actualizarPeriodo);
  const diasRenta = useCarrito((state) => state.diasRenta());
  const totalPiezas = useCarrito((state) => state.totalPiezas());
  const totalRenta = useCarrito((state) => state.totalRenta());
  const depositoGarantia = useCarrito((state) => state.depositoGarantia());
  const totalReserva = useCarrito((state) => state.totalReserva());
  const { usuario } = useSesion();
  const navegar = useNavigate();

  function finalizarReserva() {
    cerrar();
    navegar(usuario ? '/pago' : '/login', {
      state: usuario ? undefined : { desde: '/pago' },
    });
  }

  return (
    <div className="modal-fondo" onMouseDown={(event) => {
      if (event.target === event.currentTarget) cerrar();
    }}>
      <aside className="lista-renta" role="dialog" aria-modal="true" aria-labelledby="lista-renta-titulo">
        <div className="lista-renta__encabezado">
          <h2 id="lista-renta-titulo">Tu lista de renta</h2>
          <button className="lista-renta__cerrar" type="button" onClick={cerrar} aria-label="Cerrar">×</button>
        </div>
        <div className="lista-renta__items">
          {lista.length > 0 && (
            <section className="lista-renta__resumen" aria-label="Resumen de renta">
              <h3>Periodo de renta</h3>
              <label className="campo-fecha">
                <span className="campo-fecha__etiqueta">FECHA DE ENTREGA</span>
                <input
                  className="campo-fecha__control"
                  type="date"
                  min={fechaMinima}
                  value={fechaEntrega}
                  onChange={(event) => actualizarPeriodo(event.target.value, fechaRecoleccion)}
                />
              </label>
              <span className="lista-renta__flecha" aria-hidden="true">↓</span>
              <label className="campo-fecha">
                <span className="campo-fecha__etiqueta">FECHA DE RECOLECCIÓN</span>
                <input
                  className="campo-fecha__control"
                  type="date"
                  min={fechaEntrega || fechaMinima}
                  value={fechaRecoleccion}
                  onChange={(event) => actualizarPeriodo(fechaEntrega, event.target.value)}
                />
              </label>
              <dl className="lista-renta__totales">
                <div><dt>Cant. de artículos</dt><dd>{lista.length}</dd></div>
                <div><dt>Cant. de piezas</dt><dd>{totalPiezas}</dd></div>
                <div><dt>Días de renta</dt><dd>{diasRenta}</dd></div>
                <div><dt>Total de artículos</dt><dd>{formatoPrecio(totalRenta)}</dd></div>
                <div><dt>Depósito de garantía (20%)</dt><dd>{formatoPrecio(depositoGarantia)}</dd></div>
                <div className="lista-renta__total"><dt>Total</dt><dd>{formatoPrecio(totalReserva)}</dd></div>
              </dl>
            </section>
          )}
          {lista.length === 0 ? (
            <p className="lista-renta__vacia">Todavía no agregas equipo.<br />Explora el catálogo para comenzar.</p>
          ) : lista.map(({ articulo, cantidad }) => (
            <article className="lista-renta__item" key={articulo.id}>
              {articulo.fotografiasUrl[0] && (
                <img src={urlImagen(articulo.fotografiasUrl[0])} alt="" />
              )}
              <div>
                <p className="lista-renta__nombre">{articulo.nombre}</p>
                <p className="lista-renta__meta">{cantidad} × {formatoPrecio(articulo.precioPorDia)} / día</p>
              </div>
              <button className="lista-renta__quitar" type="button" onClick={() => quitar(articulo.id)}>Quitar</button>
            </article>
          ))}
        </div>
        <div className="lista-renta__pie">
          {lista.length > 0 ? (
            <button className="boton boton--ambar boton--ancho" type="button" onClick={finalizarReserva} disabled={diasRenta <= 0}>
              Finalizar reserva
            </button>
          ) : (
            <button className="boton boton--ancho" type="button" onClick={cerrar}>Seguir explorando</button>
          )}
        </div>
      </aside>
    </div>
  );
}
