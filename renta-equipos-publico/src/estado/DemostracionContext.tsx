import { useCallback, useMemo, useState, type ReactNode } from 'react';
import type { ArticuloDemo } from '../catalogo/articulos-demo.ts';
import { DemostracionContext, type ArticuloEnLista } from './demostracion-context.ts';

export function ProveedorDemostracion({ children }: { children: ReactNode }) {
  const [lista, setLista] = useState<ArticuloEnLista[]>([]);

  function agregar(articulo: ArticuloDemo, cantidad: number) {
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
  }

  function quitar(id: number) {
    setLista((actual) => actual.filter((item) => item.articulo.id !== id));
  }

  const vaciar = useCallback(() => setLista([]), []);

  const valor = useMemo(
    () => ({
      lista,
      totalPiezas: lista.reduce((total, item) => total + item.cantidad, 0),
      agregar,
      quitar,
      vaciar,
    }),
    [lista, vaciar],
  );

  return (
    <DemostracionContext.Provider value={valor}>
      {children}
    </DemostracionContext.Provider>
  );
}
