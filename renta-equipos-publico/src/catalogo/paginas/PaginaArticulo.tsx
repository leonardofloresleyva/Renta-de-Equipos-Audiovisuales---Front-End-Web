import { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router';
import { NoEncontrado } from '../../componentes/NoEncontrado.tsx';
import { TarjetaArticulo } from '../componentes/TarjetaArticulo.tsx';
import { useArticulo } from '../hooks/useArticulo.ts';
import { useArticulos } from '../hooks/useArticulos.ts';
import type { Articulo } from '../../tipos.ts';
import { urlImagen } from '../../services/api.ts';
import '../styles/pagina-articulo.css';
import { useCarrito } from '../../estado/global/carrito.ts';
import { formatoPrecio } from '../../utils/formato.precio.ts';

function esArticulo(valor: unknown): valor is Articulo {
  if (typeof valor !== 'object' || valor === null) return false;
  const articulo = valor as Partial<Articulo>;
  return (
    typeof articulo.id === 'number' &&
    typeof articulo.nombre === 'string' &&
    typeof articulo.descripcion === 'string' &&
    typeof articulo.precioPorDia === 'number' &&
    typeof articulo.existencias === 'number' &&
    typeof articulo.categoria === 'string' &&
    Array.isArray(articulo.fotografiasUrl) &&
    articulo.fotografiasUrl.every((url) => typeof url === 'string')
  );
}

export default function PaginaArticulo() {

  const { id } = useParams();
  const idArticulo = Number(id);
  const idValido = Number.isSafeInteger(idArticulo) && idArticulo > 0;
  const location = useLocation();
  const articuloEnRuta = esArticulo(location.state) && location.state.id === idArticulo ? location.state : null;

  const {
    articulo: articuloApi,
    cargando: cargandoApi,
    error,
    reintentar,
  } = useArticulo(idArticulo, idValido && articuloEnRuta === null);

  const articuloActual: Articulo | null = articuloEnRuta ?? (
    articuloApi?.id === idArticulo ? articuloApi : null
  );

  const cargando = articuloEnRuta === null && cargandoApi;

  const lista = useCarrito((state) => state.lista);
  const fechaEntrega = useCarrito((state) => state.fechaEntrega);
  const fechaRecoleccion = useCarrito((state) => state.fechaRecoleccion);
  const actualizarPeriodo = useCarrito((state) => state.actualizarPeriodo);
  const agregar = useCarrito((state) => state.agregar);

  const [cantidad, setCantidad] = useState(1);
  const [aviso, setAviso] = useState('');

  const { articulos: articulosCatalogo } = useArticulos({});

  const periodoValido =
    Boolean(fechaEntrega) &&
    Boolean(fechaRecoleccion) &&
    fechaRecoleccion > fechaEntrega;

  if (!idValido) return <NoEncontrado />;

  if (!articuloActual && cargando) {
    return <div className="pagina-articulo__estado" role="status" aria-live="polite">Cargando artículo…</div>;
  }

  if (!articuloActual && error) {
    return (
      <div className="pagina-articulo__estado" role="alert">
        <h1>No se pudo cargar el artículo</h1>
        <p>{error}</p>
        <button className="boton" type="button" onClick={reintentar}>Reintentar</button>
      </div>
    );
  }

  if (!articuloActual) return <NoEncontrado />;

  const dias = periodoValido
    ? Math.ceil(
      (new Date(`${fechaRecoleccion}T12:00:00`).getTime() -
        new Date(`${fechaEntrega}T12:00:00`).getTime()) /
      86_400_000,
    )
    : 0;

  const relacionados = articulosCatalogo
    .filter((item) => item.id !== articuloActual.id)
    .slice(0, 3);

  function agregarALista() {
    if (!periodoValido || !articuloActual) return;
    agregar(articuloActual, cantidad);
    setAviso(`${cantidad} ${cantidad === 1 ? 'pieza agregada' : 'piezas agregadas'} a tu lista de renta.`);
    window.setTimeout(() => setAviso(''), 2800);
  }

  return (
    <div className="pagina-articulo">
      <Link to="/catalogo" className="detalle__volver">
        <span aria-hidden="true">←</span> Volver al catálogo
      </Link>
      <article className="detalle">
        <div className="detalle__visual">
          {articuloActual.fotografiasUrl[0] && (
            <img
              className="detalle__imagen"
              src={urlImagen(articuloActual.fotografiasUrl[0])}
              alt={articuloActual.nombre}
            />
          )}
          <span className="detalle__etiqueta-visual">VISTA DEL EQUIPO</span>
        </div>
        <div className="detalle__datos">
          <hr className="detalle__divisor" />
          <h1 className="detalle__titulo">{articuloActual.nombre}</h1>
          <p className="detalle__precio">{formatoPrecio(articuloActual.precioPorDia)} <small>por día</small></p>
          <span className="etiqueta-categoria">{articuloActual.categoria}</span>
          <p className="detalle__descripcion">{articuloActual.descripcion}</p>
          <div className="detalle__caracteristicas" aria-label="Características">
            <span>{articuloActual.existencias} piezas en catálogo</span>
          </div>

          <div className="detalle__periodo">
            <div className="detalle__periodo-titulo">
              <span>Periodo de renta</span>
              <span className="detalle__dias">
                {periodoValido ? `${dias} ${dias === 1 ? 'día seleccionado' : 'días seleccionados'}` : 'Selecciona fechas'}
              </span>
            </div>
            <label className="campo-fecha">
              <span className="sr-only">Fecha de entrega</span>
              <input
                className="campo-fecha__control"
                type="date"
                value={fechaEntrega}
                disabled={lista.length > 0}
                onChange={(event) => actualizarPeriodo(event.target.value, fechaRecoleccion)}
              />
            </label>
            <span className="flecha-periodo" aria-hidden="true">→</span>
            <label className="campo-fecha">
              <span className="sr-only">Fecha de recolección</span>
              <input
                className="campo-fecha__control"
                type="date"
                min={fechaEntrega || undefined}
                value={fechaRecoleccion}
                disabled={lista.length > 0}
                onChange={(event) => actualizarPeriodo(fechaEntrega, event.target.value)}
              />
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
          <button
            className="boton boton--ambar boton--ancho"
            type="button"
            onClick={agregarALista}
            disabled={!periodoValido}
          >
            <svg viewBox="0 0 24 24" width="19" height="19" fill="none" aria-hidden="true">
              <path d="M3 4h2l2.2 11.1a2 2 0 0 0 2 1.6h8.5a2 2 0 0 0 1.9-1.4L22 8H6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="10" cy="20" r="1.5" fill="currentColor" />
              <circle cx="18" cy="20" r="1.5" fill="currentColor" />
            </svg>
            Agregar a lista de renta
          </button>
          <p className="detalle__ayuda">
            {lista.length > 0
              ? 'Puedes ajustar las fechas desde tu lista de renta.'
              : periodoValido
                ? 'La disponibilidad final se confirma al solicitar la renta.'
                : 'Selecciona fechas válidas para agregar este artículo.'}
          </p>
          {aviso && <p className="aviso-demo" role="status">{aviso}</p>}
        </div>
      </article>

      <section className="detalle__relacionados">
        <h2>También podría interesarte</h2>
        <div className="rejilla-articulos">
          {relacionados.map((relacionado) => (
            <TarjetaArticulo
              key={relacionado.id}
              articulo={relacionado}
              puedeAgregar={periodoValido}
              alAgregar={(item) => agregar(item, 1)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
