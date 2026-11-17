import { useCallback, useMemo, useState, type ReactNode } from 'react';
import type { ArticuloDemo } from '../catalogo/articulos-demo.ts';
import { DemostracionContext, type ArticuloEnLista } from './demostracion-context.ts';

function formatoFechaLocal(fecha: Date): string {
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
}

function sumarDias(fecha: string, dias: number): string {
  const resultado = new Date(`${fecha}T12:00:00`);
  resultado.setDate(resultado.getDate() + dias);
  return formatoFechaLocal(resultado);
}

function diasEntre(inicio: string, fin: string): number {
  const convertir = (fecha: string) => {
    const [anio, mes, dia] = fecha.split('-').map(Number);
    return Date.UTC(anio, mes - 1, dia);
  };
  return Math.max(1, Math.ceil((convertir(fin) - convertir(inicio)) / 86_400_000));
}

export function ProveedorDemostracion({ children }: { children: ReactNode }) {
  const [lista, setLista] = useState<ArticuloEnLista[]>([]);
  const [fechaMinima] = useState(() => {
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    return formatoFechaLocal(manana);
  });
  const [fechaEntrega, setFechaEntrega] = useState(fechaMinima);
  const [fechaRecoleccion, setFechaRecoleccion] = useState(() => sumarDias(fechaMinima, 3));

  const agregar = useCallback((articulo: ArticuloDemo, cantidad: number) => {
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
  }, []);

  const quitar = useCallback((id: number) => {
    setLista((actual) => actual.filter((item) => item.articulo.id !== id));
  }, []);

  const cambiarFechaEntrega = useCallback((fecha: string) => {
    setFechaEntrega(fecha);
    setFechaRecoleccion((actual) => actual <= fecha ? sumarDias(fecha, 3) : actual);
  }, []);

  const cambiarFechaRecoleccion = useCallback((fecha: string) => {
    if (fecha > fechaEntrega) setFechaRecoleccion(fecha);
  }, [fechaEntrega]);

  const diasRenta = diasEntre(fechaEntrega, fechaRecoleccion);
  const totalArticulos = lista.reduce(
    (total, item) => total + item.articulo.precioPorDia * item.cantidad * diasRenta,
    0,
  );
  const depositoGarantia = Math.round(totalArticulos * 0.2 * 100) / 100;

  const valor = useMemo(
    () => ({
      lista,
      totalPiezas: lista.reduce((total, item) => total + item.cantidad, 0),
      fechaEntrega,
      fechaRecoleccion,
      fechaMinima,
      diasRenta,
      totalArticulos,
      depositoGarantia,
      totalReserva: totalArticulos + depositoGarantia,
      agregar,
      quitar,
      limpiar: () => setLista([]),
      cambiarFechaEntrega,
      cambiarFechaRecoleccion,
    }),
    [lista, fechaEntrega, fechaRecoleccion, fechaMinima, diasRenta, totalArticulos, depositoGarantia, agregar, quitar, cambiarFechaEntrega, cambiarFechaRecoleccion],
  );

  return (
    <DemostracionContext.Provider value={valor}>
      {children}
    </DemostracionContext.Provider>
  );
}
