import { useEffect, useState } from 'react';
import type { Articulo } from '../../tipos.ts';
import { traerArticulo } from '../../services/catalogo.ts';

export function useArticulo(id: number, habilitado = true) {
  const [respuesta, setRespuesta] = useState<{
    clave: string;
    articulo: Articulo | null;
    error: string | null;
  } | null>(null);

  const [intento, setIntento] = useState(0);
  
  const clave = `${id}:${intento}`;

  useEffect(() => {
    if (!habilitado) return;
    let vigente = true;
    traerArticulo(id)
      .then((articulo) => {
        if (vigente) setRespuesta({ clave, articulo, error: null });
      })
      .catch(() => {
        if (vigente) {
          setRespuesta({
            clave,
            articulo: null,
            error: 'No fue posible cargar el artículo. Intenta de nuevo.',
          });
        }
      });

    return () => {
      vigente = false;
    };
  }, [id, intento, habilitado, clave]);

  function reintentar() {
    setIntento((actual) => actual + 1);
  }

  const respuestaActual = respuesta?.clave === clave ? respuesta : null;
  return {
    articulo: respuestaActual?.articulo ?? null,
    cargando: habilitado && respuestaActual === null,
    error: respuestaActual?.error ?? null,
    reintentar,
  };
}
