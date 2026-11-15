import { Link } from 'react-router';
import type { ArticuloDemo } from './articulos-demo.ts';
import { formatoPrecio } from './articulos-demo.ts';

export function TarjetaArticulo({
  articulo,
  alAgregar,
}: {
  articulo: ArticuloDemo;
  alAgregar: (articulo: ArticuloDemo) => void;
}) {
  return (
    <article className="tarjeta-articulo">
      <Link to={`/articulos/${articulo.id}`} className="tarjeta-articulo__enlace">
        <div className="tarjeta-articulo__visual">
          <img
            className="tarjeta-articulo__imagen"
            src={articulo.fotografiasUrl[0]}
            alt={articulo.nombre}
            loading="lazy"
          />
          <span className="tarjeta-articulo__categoria">{articulo.categoria}</span>
          <span className="tarjeta-articulo__controles" aria-hidden="true">
            <span className="control-circular">‹</span>
            <span className="control-circular">›</span>
          </span>
          <span className="puntos-imagen" aria-hidden="true"><span /><span /><span /></span>
        </div>
        <div className="tarjeta-articulo__cuerpo">
          <h2 className="tarjeta-articulo__titulo">{articulo.nombre}</h2>
          <p className="tarjeta-articulo__meta">{articulo.resumen}</p>
          <span className="tarjeta-articulo__precio">
            {formatoPrecio(articulo.precioPorDia)} <small>por día</small>
          </span>
        </div>
      </Link>
      <button
        className="boton-agregar-mini"
        type="button"
        onClick={() => alAgregar(articulo)}
        aria-label={`Agregar ${articulo.nombre} a la lista de renta`}
      >
        + Agregar
      </button>
    </article>
  );
}
