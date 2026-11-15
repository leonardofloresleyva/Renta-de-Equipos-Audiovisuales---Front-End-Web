import { useMemo, useState, type ReactNode } from 'react';
import { reservasDemoIniciales } from './reservas-demo.ts';
import { ReservasContext } from './reservas-context.ts';

export function ProveedorReservas({ children }: { children: ReactNode }) {
  const [reservas, setReservas] = useState(reservasDemoIniciales);

  function solicitarCancelacion(id: string, motivo: string) {
    setReservas((actuales) =>
      actuales.map((reserva) =>
        reserva.id === id
          ? { ...reserva, estado: 'Cancelación solicitada', motivoCancelacion: motivo }
          : reserva,
      ),
    );
  }

  const valor = useMemo(() => ({ reservas, solicitarCancelacion }), [reservas]);

  return <ReservasContext.Provider value={valor}>{children}</ReservasContext.Provider>;
}
