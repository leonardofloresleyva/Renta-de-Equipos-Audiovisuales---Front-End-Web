import type { OrdenCatalogo } from '../../tipos.ts';

const opcionesOrden = [
    { valor: 'predeterminado', etiqueta: 'Sin ordenar' },
    { valor: 'nombre', etiqueta: 'Nombre: A a Z' },
    { valor: 'precio-asc', etiqueta: 'Precio: menor a mayor' },
    { valor: 'precio-desc', etiqueta: 'Precio: mayor a menor' },
] as const satisfies readonly { valor: OrdenCatalogo; etiqueta: string }[];

type BarraSuperiorProps = {
    valor: string;
    orden: OrdenCatalogo;
    onValorChange: (valor: string) => void;
    onOrdenChange: (orden: OrdenCatalogo) => void;
};

export default function BarraSuperior({ valor, orden, onValorChange, onOrdenChange }: BarraSuperiorProps) {
    return (
        <div className="panel catalogo__herramientas">

            <label className="buscador">
                <span className="sr-only">Buscar artículos</span>
                <input
                    className="buscador__control"
                    type="search"
                    placeholder="Buscar por nombre"
                    value={valor}
                    onChange={(event) => onValorChange(event.target.value)}
                />
                <svg className="buscador__icono" viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
                    <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.8" />
                    <path d="m16 16 4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
            </label>

            <label className="orden">
                <span className="orden__etiqueta">Ordenar por</span>
                <span className="sr-only">Ordenar artículos</span>
                <select 
                    className="orden__control"
                    value={orden}
                    onChange={(event) => {
                        const opcion = opcionesOrden.find(({ valor }) => valor === event.target.value);
                        if (opcion) onOrdenChange(opcion.valor);
                    }}
                >
                    {opcionesOrden.map(({ valor, etiqueta }) => (
                        <option key={valor} value={valor}>{etiqueta}</option>
                    ))}
                </select>
            </label>

        </div>
    );
}