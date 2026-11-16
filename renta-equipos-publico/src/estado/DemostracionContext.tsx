import { useCallback, useMemo, useState, type ReactNode } from 'react';
import type { ArticuloDemo } from '../catalogo/articulos-demo.ts';
import { DemostracionContext, type ArticuloEnLista } from './demostracion-context.ts';

export function ProveedorDemostracion({ children }: { children: ReactNode }) {
  const [lista, setLista] = useState<ArticuloEnLista[]>([]);
  const [fechaEntrega, setFechaEntrega] = useState('');
  const [fechaRecoleccion, setFechaRecoleccion] = useState('');

  const actualizarPeriodo = useCallback(
    (nuevaFechaEntrega: string, nuevaFechaRecoleccion: string) => {
      if (lista.length > 0) return;
      setFechaEntrega(nuevaFechaEntrega);
      setFechaRecoleccion(
        nuevaFechaEntrega &&
          nuevaFechaRecoleccion &&
          nuevaFechaRecoleccion <= nuevaFechaEntrega
          ? ''
          : nuevaFechaRecoleccion,
      );
    },
    [lista.length],
  );

  const agregar = useCallback(
    (articulo: ArticuloDemo, cantidad: number) => {
      if (!fechaEntrega || !fechaRecoleccion || fechaRecoleccion <= fechaEntrega) return;
      setLista((actual) => {
        const existe = actual.find((item) => item.articulo.id === articulo.id);
        if (existe) {
          return actual.map((item) =>
            item.articulo.id === articulo.id
              ? { ...item, cantidad: Math.min(item.cantidad + cantidad, articulo.existencias) }
              : item,
          );
        }
        return [...actual, { articulo, cantidad: Math.min(cantidad, articulo.existencias) }];
      });
    },
    [fechaEntrega, fechaRecoleccion],
  );

  const quitar = useCallback(
    (id: number) => {
      setLista((actual) => actual.filter((item) => item.articulo.id !== id));
    },
    [],
  );

  const valor = useMemo(
    () => ({
      lista,
      totalPiezas: lista.reduce((total, item) => total + item.cantidad, 0),
      fechaEntrega,
      fechaRecoleccion,
      actualizarPeriodo,
      agregar,
      quitar,
    }),
    [lista, fechaEntrega, fechaRecoleccion, actualizarPeriodo, agregar, quitar],
  );

  return (
    <DemostracionContext.Provider value={valor}>
      {children}
    </DemostracionContext.Provider>
  );
}
