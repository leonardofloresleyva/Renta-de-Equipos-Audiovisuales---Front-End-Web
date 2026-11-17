import { useDemostracion } from '../estado/useDemostracion.ts';
import { formatoPrecio } from '../catalogo/articulos-demo.ts';
import { useNavigate } from 'react-router';
import { esClienteAutenticado } from '../services/sesion.ts';

export function ListaRentaPanel({ cerrar }: { cerrar: () => void }) {
  const navigate = useNavigate();
  const {
    lista,
    quitar,
    fechaEntrega,
    fechaRecoleccion,
    fechaMinima,
    diasRenta,
    totalPiezas,
    totalArticulos,
    depositoGarantia,
    totalReserva,
    cambiarFechaEntrega,
    cambiarFechaRecoleccion,
  } = useDemostracion();

  function finalizarReserva() {
    cerrar();
    navigate(esClienteAutenticado() ? '/pago' : '/login', {
      state: { from: '/pago' },
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
          <section className="lista-renta__resumen" aria-label="Resumen de renta">
            <h3>Periodo de renta</h3>
            <label className="campo-fecha">
              <span className="sr-only">Fecha de entrega</span>
              <input className="campo-fecha__control" type="date" min={fechaMinima} value={fechaEntrega} onChange={(event) => cambiarFechaEntrega(event.target.value)} />
            </label>
            <span className="lista-renta__flecha" aria-hidden="true">↓</span>
            <label className="campo-fecha">
              <span className="sr-only">Fecha de recolección</span>
              <input className="campo-fecha__control" type="date" min={fechaEntrega} value={fechaRecoleccion} onChange={(event) => cambiarFechaRecoleccion(event.target.value)} />
            </label>
            <dl className="lista-renta__totales">
              <div><dt>Cant. de artículos</dt><dd>{lista.length}</dd></div>
              <div><dt>Cant. de piezas</dt><dd>{totalPiezas}</dd></div>
              <div><dt>Días de renta</dt><dd>{diasRenta}</dd></div>
              <div><dt>Total artículos</dt><dd>{formatoPrecio(totalArticulos)}</dd></div>
              <div><dt>Depósito de garantía (20%)</dt><dd>{formatoPrecio(depositoGarantia)}</dd></div>
              <div className="lista-renta__total"><dt>Total</dt><dd>{formatoPrecio(totalReserva)}</dd></div>
            </dl>
          </section>
          {lista.length === 0 ? (
            <p className="lista-renta__vacia">Todavía no agregas equipo.<br />Explora el catálogo para comenzar.</p>
          ) : lista.map(({ articulo, cantidad }) => (
            <article className="lista-renta__item" key={articulo.id}>
              <img src={articulo.fotografiasUrl[0]} alt="" />
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
            <button className="boton boton--ambar boton--ancho" type="button" onClick={finalizarReserva}>Finalizar reserva</button>
          ) : (
            <button className="boton boton--ancho" type="button" onClick={cerrar}>Seguir explorando</button>
          )}
          <p className="formulario__nota">El depósito se estima localmente como el 20% del costo de renta.</p>
        </div>
      </aside>
    </div>
  );
}
