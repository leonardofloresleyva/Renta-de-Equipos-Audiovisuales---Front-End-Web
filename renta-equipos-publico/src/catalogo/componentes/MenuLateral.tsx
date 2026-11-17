import { useCarrito } from '../../estado/global/carrito';

type MenuLateralProps = {
  categorias: string[];
  cargandoCategorias: boolean;
  categoria: string;
  precioMinimo: string;
  precioMaximo: string;
  onCategoriaChange: (valor: string) => void;
  onPrecioMinimoChange: (valor: string) => void;
  onPrecioMaximoChange: (valor: string) => void;
  onLimpiarFiltros: () => void;
};

export default function MenuLateral({
  categorias,
  cargandoCategorias,
  categoria,
  precioMinimo,
  precioMaximo,
  onCategoriaChange,
  onPrecioMinimoChange,
  onPrecioMaximoChange,
  onLimpiarFiltros,
}: MenuLateralProps) {

  const lista = useCarrito((state) => state.lista);
  const fechaEntrega = useCarrito((state) => state.fechaEntrega);
  const fechaRecoleccion = useCarrito((state) => state.fechaRecoleccion);
  const actualizarPeriodo = useCarrito((state) => state.actualizarPeriodo);

  const periodoValido = Boolean(fechaEntrega) && Boolean(fechaRecoleccion) && fechaRecoleccion > fechaEntrega;
  const dias = periodoValido
    ? Math.ceil(
      (new Date(`${fechaRecoleccion}T12:00:00`).getTime() -
        new Date(`${fechaEntrega}T12:00:00`).getTime()) /
      86_400_000,
    )
    : 0;

  function actualizarPrecio(valor: string, actualizar: (valor: string) => void) {
    if (valor === '') {
      actualizar('');
      return;
    }
    const numero = Number(valor);
    if (Number.isFinite(numero) && numero >= 0) actualizar(valor);
  }

  return (
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
          <p className="periodo__bloqueado">Puedes ajustar las fechas desde tu lista de renta.</p>
        )}
      </section>

      <section className="panel filtros">
        <div className="filtros__encabezado">
          <h2>Filtros</h2>
          <button className="enlace-limpiar" type="button" onClick={onLimpiarFiltros}>
            Limpiar
          </button>
        </div>

        <div className="filtros__grupo">
          <h3 className="filtros__titulo">Categoría</h3>

          <label className="filtro-opcion">
            <input
              type="radio"
              name="categoria-catalogo"
              checked={categoria === ''}
              onChange={() => onCategoriaChange('')}
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
                onChange={() => onCategoriaChange(opcion)}
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
              onChange={(event) => actualizarPrecio(event.target.value, onPrecioMinimoChange)}
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
              onChange={(event) => actualizarPrecio(event.target.value, onPrecioMaximoChange)}
            />
          </label>
        </div>
      </section>
    </aside>
  );
}