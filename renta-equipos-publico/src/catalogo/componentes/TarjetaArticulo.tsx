import { Link } from 'react-router';
import { useState } from 'react';
import { formatoPrecio } from '../articulos-demo.ts';
import '../styles/tarjeta-catalogo.css';
import { urlImagen } from '../../services/api.ts';
import type { Articulo } from '../../tipos.ts';

export function TarjetaArticulo({
  articulo,
  alAgregar,
  puedeAgregar = true,
}: {
  articulo: Articulo;
  alAgregar: (articulo: Articulo) => void;
  puedeAgregar?: boolean;
}) {

  const [indiceImagen, setIndiceImagen] = useState(0);
  const imagenes = articulo.fotografiasUrl;
  const indiceActual = imagenes.length > 0 ? indiceImagen % imagenes.length : 0;

  return (
    <article className="tarjeta-articulo">
      <div className="tarjeta-articulo__visual">
        <Link
          to={`/articulos/${articulo.id}`}
          state={articulo}
          className="tarjeta-articulo__visual-enlace"
        >
          {imagenes[indiceActual] && (
            <img
              className="tarjeta-articulo__imagen"
              src={urlImagen(imagenes[indiceActual])}
              alt={articulo.nombre}
              loading="lazy"
            />
          )}
          <span className="tarjeta-articulo__categoria">{articulo.categoria}</span>
        </Link>
        {imagenes.length > 1 && (
          <>
            <div className="tarjeta-articulo__controles">
              <button
                className="control-circular"
                type="button"
                aria-label={`Imagen anterior de ${articulo.nombre}`}
                onClick={() =>
                  setIndiceImagen((actual) => (actual - 1 + imagenes.length) % imagenes.length)
                }
              >
                ‹
              </button>
              <button
                className="control-circular"
                type="button"
                aria-label={`Imagen siguiente de ${articulo.nombre}`}
                onClick={() => setIndiceImagen((actual) => (actual + 1) % imagenes.length)}
              >
                ›
              </button>
            </div>
            <div className="puntos-imagen" aria-label={`Imagen ${indiceActual + 1} de ${imagenes.length}`}>
              {imagenes.map((imagen, indice) => (
                <span
                  key={`${imagen}-${indice}`}
                  className={indice === indiceActual ? 'punto-imagen punto-imagen--activo' : 'punto-imagen'}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <Link
        to={`/articulos/${articulo.id}`}
        state={articulo}
        className="tarjeta-articulo__enlace"
      >
        <div className="tarjeta-articulo__cuerpo">
          <h2 className="tarjeta-articulo__titulo">{articulo.nombre}</h2>
          <p className="tarjeta-articulo__meta">{articulo.descripcion}</p>
          <span className="tarjeta-articulo__precio">
            {formatoPrecio(articulo.precioPorDia)} <small>por día</small>
          </span>
        </div>
      </Link>
      <button
        className="boton-agregar-mini"
        type="button"
        onClick={() => alAgregar(articulo)}
        disabled={!puedeAgregar}
        aria-label={`Agregar ${articulo.nombre} a la lista de renta`}
      >
        {puedeAgregar ? '+ Agregar' : 'Selecciona fechas'}
      </button>
    </article>
  );
}
