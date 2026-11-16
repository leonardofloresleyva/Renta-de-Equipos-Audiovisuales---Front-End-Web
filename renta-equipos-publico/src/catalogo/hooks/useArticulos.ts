import { useEffect, useState } from 'react';
import type { Articulo, FiltrosArticulo } from '../../tipos.ts';
import { traerArticulos } from '../../services/catalogo.ts';

export function useArticulos(filtros: FiltrosArticulo) {
  const [respuesta, setRespuesta] = useState<{
    clave: string;
    articulos: Articulo[];
    error: string | null;
  } | null>(null);
  const [respuestaCategorias, setRespuestaCategorias] = useState<{
    clave: string;
    categorias: string[];
    error: string | null;
  } | null>(null);
  const [intento, setIntento] = useState(0);
  const { nombre, precioMinimo, precioMaximo, categoria } = filtros;
  const nombreFiltro = nombre?.trim() || undefined;
  const parametros: FiltrosArticulo = {
    ...(nombreFiltro ? { nombre: nombreFiltro } : {}),
    ...(precioMinimo !== undefined ? { precioMinimo } : {}),
    ...(precioMaximo !== undefined ? { precioMaximo } : {}),
    ...(categoria ? { categoria } : {}),
  };
  const claveConsulta = JSON.stringify([
    parametros.nombre ?? '',
    parametros.precioMinimo ?? null,
    parametros.precioMaximo ?? null,
    parametros.categoria ?? '',
    intento,
  ]);
  const claveCategorias = String(intento);

  useEffect(() => {
    let vigente = true;
    const parametrosConsulta: FiltrosArticulo = {
      ...(nombreFiltro ? { nombre: nombreFiltro } : {}),
      ...(precioMinimo !== undefined ? { precioMinimo } : {}),
      ...(precioMaximo !== undefined ? { precioMaximo } : {}),
      ...(categoria ? { categoria } : {}),
    };
    traerArticulos(parametrosConsulta)
      .then((datos) => {
        if (vigente) setRespuesta({ clave: claveConsulta, articulos: datos, error: null });
      })
      .catch(() => {
        if (vigente) {
          setRespuesta({
            clave: claveConsulta,
            articulos: [],
            error: 'No fue posible cargar los artículos. Intenta de nuevo.',
          });
        }
      });

    return () => {
      vigente = false;
    };
  }, [nombreFiltro, precioMinimo, precioMaximo, categoria, intento, claveConsulta]);

  useEffect(() => {
    let vigente = true;
    traerArticulos({})
      .then((datos) => {
        if (vigente) {
          const datosCategorias = [
            ...new Set(datos.map((articulo) => articulo.categoria)),
          ].sort((a, b) => a.localeCompare(b, 'es'));
          setRespuestaCategorias({
            clave: claveCategorias,
            categorias: datosCategorias,
            error: null,
          });
        }
      })
      .catch(() => {
        if (vigente) {
          setRespuestaCategorias({
            clave: claveCategorias,
            categorias: [],
            error: 'No fue posible cargar las categorías.',
          });
        }
      });

    return () => {
      vigente = false;
    };
  }, [claveCategorias]);

  function reintentar() {
    setIntento((actual) => actual + 1);
  }

  const resultadoActual = respuesta?.clave === claveConsulta ? respuesta : null;
  const categoriasActuales =
    respuestaCategorias?.clave === claveCategorias ? respuestaCategorias : null;

  return {
    articulos: resultadoActual?.articulos ?? [],
    categorias: categoriasActuales?.categorias ?? [],
    cargando: resultadoActual === null,
    cargandoCategorias: categoriasActuales === null,
    error: resultadoActual?.error ?? null,
    errorCategorias: categoriasActuales?.error ?? null,
    reintentar,
  };
}
