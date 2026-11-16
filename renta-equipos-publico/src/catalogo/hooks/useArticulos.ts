import { useEffect, useState } from "react";
import type { Articulo, FiltrosArticulo } from "../../tipos";
import { traerArticulos } from "../../services/catalogo";


export function useArticulos(filtros: FiltrosArticulo) {
    const [articulos, setArticulos] = useState<Articulo[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [intento, setIntento] = useState(0);

    useEffect(() => {
        let vigente = true;
        traerArticulos(filtros)
            .then((datos) => {if (vigente) setArticulos(datos); })
            .catch((e) => { if (vigente) setError("Algo salió mal"); })
            .finally(() => { if (vigente) setCargando(false); });
        return () => { vigente = false; };
    }, [intento]);

    function reintentar() {
        setCargando(true);
        setError(null);
        setIntento((n) => n + 1);
    }

    return {articulos, cargando, error, reintentar};
}