import { useMemo, useState } from 'react';
import { TarjetaArticulo } from '../componentes/TarjetaArticulo.tsx';
import { articulosDemo, categoriasDemo, type ArticuloDemo } from '../articulos-demo.ts';
import { useDemostracion } from '../../estado/useDemostracion.ts';

function fechaDemo(dias: number): string {
  const fecha = new Date(2026, 10, 14 + dias);
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
}

export default function PaginaCatalogo() {
  const [busqueda, setBusqueda] = useState('');
  const [categorias, setCategorias] = useState<string[]>([]);
  const [precioMaximo, setPrecioMaximo] = useState('');
  const [orden, setOrden] = useState('destacados');
  const [entrega, setEntrega] = useState(fechaDemo(0));
  const [recoleccion, setRecoleccion] = useState(fechaDemo(3));
  const [aviso, setAviso] = useState('');
  const { agregar: agregarALaLista } = useDemostracion();

  const dias = Math.max(
    1,
    Math.ceil(
      (new Date(`${recoleccion}T12:00:00`).getTime() -
        new Date(`${entrega}T12:00:00`).getTime()) /
      86_400_000,
    ),
  );

  const resultados = useMemo(() => {
    const texto = busqueda.trim().toLocaleLowerCase('es-MX');
    let articulos = articulosDemo.filter((articulo) => {
      const coincideTexto =
        !texto ||
        `${articulo.nombre} ${articulo.descripcion} ${articulo.categoria}`
          .toLocaleLowerCase('es-MX')
          .includes(texto);
      const coincideCategoria =
        categorias.length === 0 || categorias.includes(articulo.categoria);
      const coincidePrecio =
        !precioMaximo || articulo.precioPorDia <= Number(precioMaximo);
      return coincideTexto && coincideCategoria && coincidePrecio;
    });

    if (orden === 'precio-asc') {
      articulos = [...articulos].sort((a, b) => a.precioPorDia - b.precioPorDia);
    } else if (orden === 'precio-desc') {
      articulos = [...articulos].sort((a, b) => b.precioPorDia - a.precioPorDia);
    } else if (orden === 'nombre') {
      articulos = [...articulos].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
    }
    return articulos;
  }, [busqueda, categorias, orden, precioMaximo]);

  function alternarCategoria(categoria: string) {
    setCategorias((seleccionadas) =>
      seleccionadas.includes(categoria)
        ? seleccionadas.filter((item) => item !== categoria)
        : [...seleccionadas, categoria],
    );
  }

  function agregarArticulo(articulo: ArticuloDemo) {
    agregarALaLista(articulo, 1);
    setAviso(`${articulo.nombre} se agregó a tu lista de renta.`);
    window.setTimeout(() => setAviso(''), 2600);
  }

  function limpiarFiltros() {
    setBusqueda('');
    setCategorias([]);
    setPrecioMaximo('');
    setOrden('destacados');
  }

  return (
    <>
      <div className="pagina-catalogo">
        <aside className="barra-lateral" aria-label="Periodo de renta y filtros">
          <section className="panel periodo">
            <div className="periodo__encabezado">
              <h2>Periodo de renta</h2>
              <span className="etiqueta-dias">{dias} {dias === 1 ? 'día' : 'días'}</span>
            </div>
            <p className="periodo__texto">Indica las fechas de entrega y recolección de tu equipo.</p>
            <label className="campo-fecha">
              <span className="campo-fecha__etiqueta">FECHA DE ENTREGA</span>
              <input className="campo-fecha__control" type="date" value={entrega} onChange={(event) => setEntrega(event.target.value)} />
            </label>
            <label className="campo-fecha">
              <span className="campo-fecha__etiqueta">FECHA DE RECOLECCIÓN</span>
              <input className="campo-fecha__control" type="date" value={recoleccion} min={entrega} onChange={(event) => setRecoleccion(event.target.value)} />
            </label>
          </section>

          <section className="panel filtros">
            <div className="filtros__encabezado">
              <h2>Filtros</h2>
              <button className="enlace-limpiar" type="button" onClick={limpiarFiltros}>Limpiar</button>
            </div>
            <div className="filtros__grupo">
              <h3 className="filtros__titulo">Categoría</h3>
              {categoriasDemo.map((categoria) => (
                <label className="filtro-opcion" key={categoria}>
                  <input type="checkbox" checked={categorias.includes(categoria)} onChange={() => alternarCategoria(categoria)} />
                  <span>{categoria}</span>
                </label>
              ))}
            </div>
            <div className="filtros__grupo">
              <h3 className="filtros__titulo">Precio máximo por día</h3>
              <label className="campo">
                <span className="sr-only">Precio máximo en pesos</span>
                <input
                  className="campo__control"
                  type="number"
                  min="0"
                  placeholder="Sin límite"
                  value={precioMaximo}
                  onChange={(event) => setPrecioMaximo(event.target.value)}
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
              <select value={orden} onChange={(event) => setOrden(event.target.value)}>
                <option value="destacados">Destacados</option>
                <option value="precio-asc">Precio: menor a mayor</option>
                <option value="precio-desc">Precio: mayor a menor</option>
                <option value="nombre">Nombre</option>
              </select>
            </label>
          </div>

          <p className="catalogo__resumen">
            Mostrando <strong>{resultados.length} equipos</strong> disponibles
          </p>
          <div className="rejilla-articulos">
            {resultados.length ? resultados.map((articulo) => (
              <TarjetaArticulo key={articulo.id} articulo={articulo} alAgregar={agregarArticulo} />
            )) : (
              <div className="articulo-vacio">
                <h2>No encontramos equipo con esos filtros</h2>
                <p>Prueba otra búsqueda o limpia los filtros para ver todo el catálogo.</p>
                <button className="boton boton--secundario" type="button" onClick={limpiarFiltros}>Limpiar filtros</button>
              </div>
            )}
          </div>
        </section>
      </div>
      {aviso && <div className="toast" role="status">{aviso}</div>}
    </>
  );
}
