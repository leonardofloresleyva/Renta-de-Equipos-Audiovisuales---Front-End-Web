import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { NoEncontrado } from '../componentes/NoEncontrado.tsx';
import { useDemostracion } from '../estado/useDemostracion.ts';
import { articulosDemo, formatoPrecio } from '../catalogo/articulos-demo.ts';
import { TarjetaArticulo } from '../catalogo/TarjetaArticulo.tsx';

export default function PaginaArticulo() {
  const { id } = useParams();
  const articulo = articulosDemo.find((item) => item.id === Number(id));
  const {
    agregar,
    fechaEntrega,
    fechaRecoleccion,
    fechaMinima,
    diasRenta,
    cambiarFechaEntrega,
    cambiarFechaRecoleccion,
  } = useDemostracion();
  const [cantidad, setCantidad] = useState(1);
  const [aviso, setAviso] = useState('');

  if (!articulo) return <NoEncontrado />;
  const articuloActual = articulo;

  const relacionados = articulosDemo.filter((item) => item.id !== articulo.id).slice(0, 3);

  function agregarALista() {
    agregar(articuloActual, cantidad);
    setAviso(`${cantidad} ${cantidad === 1 ? 'pieza agregada' : 'piezas agregadas'} a tu lista de renta.`);
    window.setTimeout(() => setAviso(''), 2800);
  }

  return (
    <>
      <Link to="/catalogo" className="detalle__volver">
        <span aria-hidden="true">←</span> Volver al catálogo
      </Link>
      <article className="detalle">
        <div className="detalle__visual">
          <img className="detalle__imagen" src={articuloActual.fotografiasUrl[0]} alt={articuloActual.nombre} />
          <span className="detalle__etiqueta-visual">VISTA DEL EQUIPO</span>
        </div>
        <div className="detalle__datos">
          <hr className="detalle__divisor" />
          <h1 className="detalle__titulo">{articuloActual.nombre}</h1>
          <p className="detalle__precio">{formatoPrecio(articuloActual.precioPorDia)} <small>por día</small></p>
          <span className="etiqueta-categoria">{articuloActual.categoria}</span>
          <p className="detalle__descripcion">{articuloActual.descripcion}</p>
          <div className="detalle__caracteristicas" aria-label="Características">
            {articuloActual.especificaciones.map((especificacion) => (
              <span key={especificacion}>{especificacion}</span>
            ))}
            <span>{articuloActual.existencias} piezas en catálogo</span>
          </div>

          <div className="detalle__periodo">
            <div className="detalle__periodo-titulo">
              <span>Periodo de renta</span>
              <span className="detalle__dias">{diasRenta} {diasRenta === 1 ? 'día seleccionado' : 'días seleccionados'}</span>
            </div>
            <label className="campo-fecha">
              <span className="sr-only">Fecha de entrega</span>
              <input className="campo-fecha__control" type="date" min={fechaMinima} value={fechaEntrega} onChange={(event) => cambiarFechaEntrega(event.target.value)} />
            </label>
            <span className="flecha-periodo" aria-hidden="true">→</span>
            <label className="campo-fecha">
              <span className="sr-only">Fecha de recolección</span>
              <input className="campo-fecha__control" type="date" min={fechaEntrega} value={fechaRecoleccion} onChange={(event) => cambiarFechaRecoleccion(event.target.value)} />
            </label>
          </div>

          <div className="detalle__cantidad">
            <span className="detalle__cantidad-label">Piezas a rentar</span>
            <div className="selector-cantidad" aria-label="Cantidad">
              <button type="button" aria-label="Quitar una pieza" onClick={() => setCantidad((actual) => Math.max(1, actual - 1))}>−</button>
              <span>{cantidad}</span>
              <button type="button" aria-label="Agregar una pieza" onClick={() => setCantidad((actual) => Math.min(articuloActual.existencias, actual + 1))}>+</button>
            </div>
          </div>
          <button className="boton boton--ambar boton--ancho" type="button" onClick={agregarALista}>
            <svg viewBox="0 0 24 24" width="19" height="19" fill="none" aria-hidden="true">
              <path d="M3 4h2l2.2 11.1a2 2 0 0 0 2 1.6h8.5a2 2 0 0 0 1.9-1.4L22 8H6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="10" cy="20" r="1.5" fill="currentColor" />
              <circle cx="18" cy="20" r="1.5" fill="currentColor" />
            </svg>
            Agregar a lista de renta
          </button>
          <p className="detalle__ayuda">La disponibilidad final se confirma al solicitar la renta.</p>
          {aviso && <p className="aviso-demo" role="status">{aviso} Esta es una demostración local.</p>}
        </div>
      </article>

      <section className="detalle__relacionados">
        <h2>También podría interesarte</h2>
        <div className="rejilla-articulos">
          {relacionados.map((relacionado) => (
            <TarjetaArticulo
              key={relacionado.id}
              articulo={relacionado}
              alAgregar={(item) => agregar(item, 1)}
            />
          ))}
        </div>
      </section>
    </>
  );
}
