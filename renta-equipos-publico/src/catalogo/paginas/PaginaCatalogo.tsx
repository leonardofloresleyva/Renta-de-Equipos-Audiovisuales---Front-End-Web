import { useMemo, useRef, useState } from 'react';
import { TarjetaArticulo } from '../componentes/TarjetaArticulo.tsx';
import MenuLateral from '../componentes/MenuLateral.tsx';
import { useArticulos } from '../hooks/useArticulos.ts';
import type { Articulo, OrdenCatalogo } from '../../tipos.ts';
import { useCarrito } from '../../estado/global/carrito.ts';
import { traerDisponibilidad } from '../../services/disponibilidad.ts';
import { mensajeDeError } from '../../services/api.ts';
import BarraSuperior from '../componentes/BarraSuperior.tsx';

export default function PaginaCatalogo() {

  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('');
  const [precioMinimo, setPrecioMinimo] = useState('');
  const [precioMaximo, setPrecioMaximo] = useState('');
  const [orden, setOrden] = useState<OrdenCatalogo>('predeterminado');
  const [aviso, setAviso] = useState('');
  const [avisoEsError, setAvisoEsError] = useState(false);

  const [disponibilidades, setDisponibilidades] = useState<{
    clavePeriodo: string;
    porArticulo: Record<number, number>;
  }>({ clavePeriodo: '', porArticulo: {} });

  const [verificandoIds, setVerificandoIds] = useState<Set<number>>(() => new Set());
  const verificacionesEnCurso = useRef(new Set<number>());

  const lista = useCarrito((state) => state.lista);
  const fechaEntrega = useCarrito((state) => state.fechaEntrega);
  const fechaRecoleccion = useCarrito((state) => state.fechaRecoleccion);

  const agregarALaLista = useCarrito((state) => state.agregar);

  const {
    articulos,
    categorias,
    cargando,
    cargandoCategorias,
    error,
    errorCategorias,
    reintentar
  } = useArticulos({
    nombre: busqueda,
    categoria: categoria || undefined,
    precioMinimo: precioMinimo === '' ? undefined : Number(precioMinimo),
    precioMaximo: precioMaximo === '' ? undefined : Number(precioMaximo),
  });

  const errorCatalogo = error ?? errorCategorias;

  const periodoValido = Boolean(fechaEntrega) && Boolean(fechaRecoleccion) && fechaRecoleccion > fechaEntrega;
  const clavePeriodo = `${fechaEntrega}:${fechaRecoleccion}`;

  const disponibilidadPorArticulo = disponibilidades.clavePeriodo === clavePeriodo ? disponibilidades.porArticulo : {};

  const resultados = useMemo(() => {
    if (orden === 'precio-asc') { return [...articulos].sort((a, b) => a.precioPorDia - b.precioPorDia); }
    if (orden === 'precio-desc') { return [...articulos].sort((a, b) => b.precioPorDia - a.precioPorDia); }
    if (orden === 'nombre') { return [...articulos].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es')); }
    return articulos;
  }, [articulos, orden]);

  async function agregarArticulo(articulo: Articulo) {

    if (!periodoValido || verificacionesEnCurso.current.has(articulo.id)) return;

    verificacionesEnCurso.current.add(articulo.id);

    setVerificandoIds((actual) => new Set(actual).add(articulo.id));
    try {
      const disponible = await traerDisponibilidad({
        articuloId: articulo.id,
        fechaInicio: new Date(`${fechaEntrega}T00:00:00.000Z`),
        fechaFin: new Date(`${fechaRecoleccion}T00:00:00.000Z`),
      });
      const carritoActual = useCarrito.getState();
      if (
        carritoActual.fechaEntrega !== fechaEntrega ||
        carritoActual.fechaRecoleccion !== fechaRecoleccion
      ) {
        setAvisoEsError(true);
        setAviso('El período cambió durante la consulta. Verifica las fechas e inténtalo de nuevo.');
        window.setTimeout(() => setAviso(''), 3000);
        return;
      }

      setDisponibilidades((actual) => ({
        clavePeriodo,
        porArticulo: {
          ...(actual.clavePeriodo === clavePeriodo ? actual.porArticulo : {}),
          [articulo.id]: disponible,
        },
      }));
      const cantidadEnCarrito = carritoActual.lista.find((item) => item.articulo.id === articulo.id)?.cantidad ?? 0;
      if (disponible <= cantidadEnCarrito) {
        setAvisoEsError(true);
        setAviso(
          disponible === 0
            ? `No se pudo agregar ${articulo.nombre} porque no tiene piezas disponibles en el período seleccionado.`
            : `No se pudo agregar ${articulo.nombre} porque ya alcanzaste el límite disponible en el carrito.`,
        );
        window.setTimeout(() => setAviso(''), 3000);
        return;
      }

      agregarALaLista(articulo, 1);
      setAvisoEsError(false);
      setAviso(`${articulo.nombre} se agregó a tu lista de renta.`);

      window.setTimeout(() => setAviso(''), 2600);

    } catch (error) {
      setAvisoEsError(true);
      setAviso(mensajeDeError(error, 'No pudimos consultar la disponibilidad. Inténtalo de nuevo.'));
      window.setTimeout(() => setAviso(''), 3000);

    } finally {
      verificacionesEnCurso.current.delete(articulo.id);
      setVerificandoIds((actual) => {
        const siguiente = new Set(actual);
        siguiente.delete(articulo.id);
        return siguiente;
      });
    }
  }

  function limpiarFiltros() {
    setBusqueda('');
    setCategoria('');
    setPrecioMinimo('');
    setPrecioMaximo('');
    setOrden('predeterminado');
  }

  return (
    <>
      <div className="pagina-catalogo">

        <MenuLateral
          categorias={categorias}
          cargandoCategorias={cargandoCategorias}
          categoria={categoria}
          precioMinimo={precioMinimo}
          precioMaximo={precioMaximo}
          onCategoriaChange={setCategoria}
          onPrecioMinimoChange={setPrecioMinimo}
          onPrecioMaximoChange={setPrecioMaximo}
          onLimpiarFiltros={limpiarFiltros}
        />

        <section className="catalogo__principal" aria-label="Catálogo de equipo">

          <BarraSuperior
            valor={busqueda}
            orden={orden}
            onValorChange={setBusqueda}
            onOrdenChange={setOrden}
          />

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
                verificandoDisponibilidad={verificandoIds.has(articulo.id)}
                sinDisponibilidad={
                  disponibilidadPorArticulo[articulo.id] !== undefined &&
                  disponibilidadPorArticulo[articulo.id] <=
                  (lista.find((item) => item.articulo.id === articulo.id)?.cantidad ?? 0)
                }
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

        </section>
      </div>

      {aviso && (
        <div className={avisoEsError ? 'toast catalogo__toast--error' : 'toast'} role={avisoEsError ? 'alert' : 'status'}>
          {aviso}
        </div>
      )}
    </>
  );
}
