import { useEffect, useState } from 'react';
import { mensajeDeError } from '../../services/api.ts';
import { traerArticulos } from '../../services/catalogo.ts';
import { traerArticulosDeReserva, traerGarantiaReserva } from '../../services/reservas.ts';
import type { Articulo, ArticuloReserva, DepositoGarantia } from '../../tipos.ts';

interface DetalleReserva {
  articulos: ArticuloReserva[];
  garantia: DepositoGarantia | null;
  catalogo: Articulo[];
}

interface RespuestaDetalle {
  clave: string;
  detalle: DetalleReserva | null;
  error: string | null;
}

export function useDetalleReserva(reservaId: number, habilitado = true) {
  const [respuesta, setRespuesta] = useState<RespuestaDetalle | null>(null);
  const [intento, setIntento] = useState(0);
  const clave = `${reservaId}:${intento}`;

  useEffect(() => {
    if (!habilitado) return;

    let vigente = true;

    Promise.all([
      traerArticulosDeReserva(reservaId),
      traerGarantiaReserva(reservaId),
      traerArticulos({}),
    ])
      .then(([articulos, garantia, catalogo]) => {
        if (vigente) {
          setRespuesta({ clave, detalle: { articulos, garantia, catalogo }, error: null });
        }
      })
      .catch((error) => {
        if (vigente) {
          setRespuesta({
            clave,
            detalle: null,
            error: mensajeDeError(error, 'No pudimos cargar el detalle de la reserva.'),
          });
        }
      });

    return () => {
      vigente = false;
    };
  }, [reservaId, intento, habilitado, clave]);

  const actual = respuesta?.clave === clave ? respuesta : null;

  return {
    articulos: actual?.detalle?.articulos ?? [],
    garantia: actual?.detalle?.garantia ?? null,
    catalogo: actual?.detalle?.catalogo ?? [],
    cargando: habilitado && actual === null,
    error: actual?.error ?? null,
    reintentar: () => setIntento((valor) => valor + 1),
  };
}
