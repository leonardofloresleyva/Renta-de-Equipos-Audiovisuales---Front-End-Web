import { useMemo, useState } from 'react';
import { TarjetaArticulo } from '../componentes/TarjetaArticulo.tsx';
import { useArticulos } from '../hooks/useArticulos.ts';
import { useCarrito } from '../../estado/carrito.ts';
import type { Articulo } from '../../tipos.ts';
import '../styles/pagina-catalogo.css';

type OrdenCatalogo = 'predeterminado' | 'nombre' | 'precio-asc' | 'precio-desc';

export default function PaginaCatalogo() {
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('');
  const [precioMinimo, setPrecioMinimo] = useState('');
  const [precioMaximo, setPrecioMaximo] = useState('');
  const [orden, setOrden] = useState<OrdenCatalogo>('predeterminado');
  const [aviso, setAviso] = useState('');

  const lista = useCarrito((state) => state.lista);
  const fechaEntrega = useCarrito((state) => state.fechaEntrega);
  const fechaRecoleccion = useCarrito((state) => state.fechaRecoleccion);
  const actualizarPeriodo = useCarrito((state) => state.actualizarPeriodo);
  const agregarALaLista = useCarrito((state) => state.agregar);

  const {
    articulos,
    categorias,
    cargando,
    cargandoCategorias,
    error,
    errorCategorias,
    reintentar,
  } = useArticulos({
    nombre: busqueda,
    categoria: categoria || undefined,
    precioMinimo: precioMinimo === '' ? undefined : Number(precioMinimo),
    precioMaximo: precioMaximo === '' ? undefined : Number(precioMaximo),
  });

  const errorCatalogo = error ?? errorCategorias;

  const periodoValido = Boolean(fechaEntrega) && Boolean(fechaRecoleccion) && fechaRecoleccion > fechaEntrega;
  const dias = periodoValido ? Math.ceil((new Date(`${fechaRecoleccion}T12:00:00`).getTime() - new Date(`${fechaEntrega}T12:00:00`).getTime()) / 86_400_000,) : 0;

  const resultados = useMemo(() => {
    if (orden === 'precio-asc') { return [...articulos].sort((a, b) => a.precioPorDia - b.precioPorDia); }
    if (orden === 'precio-desc') { return [...articulos].sort((a, b) => b.precioPorDia - a.precioPorDia); }
    if (orden === 'nombre') { return [...articulos].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es')); }
    return articulos;
  }, [articulos, orden]);

  function agregarArticulo(articulo: Articulo) {
    agregarALaLista(articulo, 1);
    setAviso(`${articulo.nombre} se agregó a tu lista de renta.`);
    window.setTimeout(() => setAviso(''), 2600);
  }

  function limpiarFiltros() {
    setBusqueda('');
    setCategoria('');
    setPrecioMinimo('');
    setPrecioMaximo('');
    setOrden('predeterminado');
  }

  function actualizarPrecio(valor: string, actualizar: (valor: string) => void) {
    if (valor === '') {
      actualizar('');
      return;
    }
    const numero = Number(valor);
    if (Number.isFinite(numero) && numero >= 0) actualizar(valor);
  }

  return (
    <>
      <div className="pagina-catalogo">
        <aside className="barra-lateral" aria-label="Periodo de renta y filtros">
          <section className="panel periodo">
            <div className="periodo__encabezado">
              <h2>Periodo de renta</h2>
              <span className="etiqueta-dias">
                {periodoValido ? `${dias} ${dias === 1 ? 'día' : 'días'}` : 'Sin seleccionar'}
              </span>
            </div>
            <p className="periodo__texto">Indica las fechas de entrega y recolección de tu equipo.</p>
            <label className="campo-fecha">
              <span className="campo-fecha__etiqueta">FECHA DE ENTREGA</span>
              <input
                className="campo-fecha__control"
                type="date"
                value={fechaEntrega}
                disabled={lista.length > 0}
                onChange={(event) => actualizarPeriodo(event.target.value, fechaRecoleccion)}
              />
            </label>
            <label className="campo-fecha">
              <span className="campo-fecha__etiqueta">FECHA DE RECOLECCIÓN</span>
              <input
                className="campo-fecha__control"
                type="date"
                value={fechaRecoleccion}
                min={fechaEntrega || undefined}
                disabled={lista.length > 0}
                onChange={(event) => actualizarPeriodo(fechaEntrega, event.target.value)}
              />
            </label>
            {lista.length > 0 && (
              <p className="periodo__bloqueado">Quita los artículos de la lista para cambiar el período.</p>
            )}
          </section>

          <section className="panel filtros">
            <div className="filtros__encabezado">
              <h2>Filtros</h2>
              <button className="enlace-limpiar" type="button" onClick={limpiarFiltros}>Limpiar</button>
            </div>
            <div className="filtros__grupo">
              <h3 className="filtros__titulo">Categoría</h3>
              <label className="filtro-opcion">
                <input
                  type="radio"
                  name="categoria-catalogo"
                  checked={categoria === ''}
                  onChange={() => setCategoria('')}
                />
                <span>Todas</span>
              </label>
              {cargandoCategorias && <p className="catalogo__nota">Cargando categorías…</p>}
              {categorias.map((opcion) => (
                <label className="filtro-opcion" key={opcion}>
                  <input
                    type="radio"
                    name="categoria-catalogo"
                    checked={categoria === opcion}
                    onChange={() => setCategoria(opcion)}
                  />
                  <span>{opcion}</span>
                </label>
              ))}
            </div>
            <div className="filtros__grupo filtros__precios">
              <label>
                Precio mínimo por día
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="Sin mínimo"
                  value={precioMinimo}
                  onChange={(event) => actualizarPrecio(event.target.value, setPrecioMinimo)}
                />
              </label>
              <label>
                Precio máximo por día
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="Sin máximo"
                  value={precioMaximo}
                  onChange={(event) => actualizarPrecio(event.target.value, setPrecioMaximo)}
                />
              </label>
            </div>
          </section>
        </aside>

        <section className="catalogo__principal" aria-label="Catálogo de equipo">
          <div className="panel catalogo__herramientas">
            <label className="buscador">
              <span className="sr-only">Buscar artículos</span>
              <input
                className="buscador__control"
                type="search"
                placeholder="Buscar por nombre"
                value={busqueda}
                onChange={(event) => setBusqueda(event.target.value)}
              />
              <svg className="buscador__icono" viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
                <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.8" />
                <path d="m16 16 4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </label>
            <span className="orden__etiqueta">Ordenar por</span>
            <label className="orden">
              <span className="sr-only">Ordenar artículos</span>
              <select
                value={orden}
                onChange={(event) => setOrden(event.target.value as OrdenCatalogo)}
              >
                <option value="predeterminado">Sin ordenar</option>
                <option value="nombre">Nombre: A a Z</option>
                <option value="precio-asc">Precio: menor a mayor</option>
                <option value="precio-desc">Precio: mayor a menor</option>
              </select>
            </label>
          </div>

          <p className="catalogo__resumen">
            {cargando ? 'Consultando el catálogo…' : (
              <>Mostrando <strong>{resultados.length} artículos</strong></>
            )}
          </p>
          <div className="rejilla-articulos">
            {errorCatalogo ? (
              <div className="articulo-vacio" role="alert">
                <h2>No se pudo cargar el catálogo</h2>
                <p>{errorCatalogo}</p>
                <button className="boton" type="button" onClick={reintentar}>Reintentar</button>
              </div>
            ) : cargando ? (
              <div className="articulo-vacio catalogo__carga" role="status" aria-live="polite">
                Cargando artículos…
              </div>
            ) : resultados.length ? resultados.map((articulo) => (
              <TarjetaArticulo
                key={articulo.id}
                articulo={articulo}
                puedeAgregar={periodoValido}
                alAgregar={agregarArticulo}
              />
            )) : (
              <div className="articulo-vacio">
                <h2>No encontramos artículos con esos filtros</h2>
                <p>Prueba otra búsqueda o limpia los filtros para ver el catálogo.</p>
                <button className="boton" type="button" onClick={limpiarFiltros}>Limpiar filtros</button>
              </div>
            )}
          </div>
          {!periodoValido && !cargando && !errorCatalogo && resultados.length > 0 && (
            <p className="catalogo__nota" role="status">
              Selecciona una fecha de entrega y otra de recolección para agregar artículos.
            </p>
          )}
        </section>
      </div>
      {aviso && <div className="toast" role="status">{aviso}</div>}
    </>
  );
}
