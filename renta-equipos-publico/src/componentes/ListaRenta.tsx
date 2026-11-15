import { useDemostracion } from '../estado/useDemostracion.ts';
import { formatoPrecio } from '../catalogo/articulos-demo.ts';

export function ListaRentaPanel({ cerrar }: { cerrar: () => void }) {
  const { lista, quitar } = useDemostracion();

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
          <p className="formulario__nota">Maqueta de demostración: la lista no se envía al servicio.</p>
          <button className="boton boton--ancho" type="button" onClick={cerrar}>Seguir explorando</button>
        </div>
      </aside>
    </div>
  );
}
