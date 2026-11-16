import { useEffect, useState } from "react";
import type { Articulo } from "../../tipos";
import { traerArticulo } from "../../services/catalogo";


export function useArticulo(id: number) {
    const [articulo, setArticulo] = useState<Articulo | null>(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [intento, setIntento] = useState(0);

    useEffect(() => {
        let vigente = true;
        traerArticulo(id)
            .then((dato) => { if (vigente) setArticulo(dato); } )
            .catch((e) => { setError("Algo salió mal"); })
            .finally(() => { if (vigente) setCargando(false); });
        return () => { vigente = false; };
    }, [intento]);

    function reintentar() {
        setCargando(true);
        setError(null);
        setIntento((n) => n + 1);
    }

    return {articulo, cargando, error, reintentar};
}