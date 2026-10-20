import { BITACORAS, INSPECIONES_PIEZA } from "src/datos/renta.equipo.seed";
import { BitacoraReservaRepository } from "../repositorios/bitacora.reserva.repository";
import { BitacoraReserva, InspeccionPieza, NuevoInspeccionPieza } from "src/dominio/entidades";

export class BitacoraReservaMemoriaRepository implements BitacoraReservaRepository {

    private proximoBitacoraId = 1;
    private proximoInspeccionId = 1;

    async listar(): Promise<BitacoraReserva[]> {
        return [...BITACORAS.values()];
    }

    async buscarPorId(id: number): Promise<BitacoraReserva | null> {
        const bitacora = BITACORAS.get(id);
        return (bitacora) ? bitacora : null;
    }

    async buscarPorReserva(idReserva: number): Promise<BitacoraReserva | null> {
        const bitacora = [...BITACORAS.values()].find((b) => b.reservaId === idReserva);
        return (bitacora) ? bitacora : null;
    }

    async entregar(datos: Omit<BitacoraReserva, "id" | "fechaHoraEntregada" | 'fechaHoraRecolectada'>): Promise<BitacoraReserva> {
        const id = this.proximoBitacoraId;
        const nuevaBitacora: BitacoraReserva = {
            id: id,
            reservaId: datos.reservaId,
            fechaHoraEntregada: new Date(),
            montoTotalGarantia: datos.montoTotalGarantia
        };
        BITACORAS.set(id, nuevaBitacora);
        return nuevaBitacora;
    }

    async recolectar(id: number, inspeccionesPiezas: NuevoInspeccionPieza[]): Promise<BitacoraReserva | null> {
        const bitacora = BITACORAS.get(id);
        if (!bitacora) return null;

        bitacora.fechaHoraRecolectada = new Date();
        inspeccionesPiezas.forEach((p) => {
            const id = this.proximoInspeccionId++;
            const inspeccionArticulo: InspeccionPieza = {
                id: id,
                articuloReservadoId: p.articuloReservadoId,
                bitacoraReservaId: id,
                piezasCompletas: p.piezasCompletas,
                piezasDaniadas: p.piezasDaniadas,
                piezasFaltantes: p.piezasFaltantes,
                montoGarantia: p.montoGarantia
            }
            INSPECIONES_PIEZA.set(id, inspeccionArticulo);
        });
        return bitacora;
    }
}