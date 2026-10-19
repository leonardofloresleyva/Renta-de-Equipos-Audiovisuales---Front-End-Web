import { ARTICULOS_RESERVA, CLIENTES, DEPOSITOS_GARANTIA, RESERVAS, SOLICITUDES_CANCELACION } from "src/datos/renta.equipo.seed";
import { ReservaRepository } from "../repositorios/reserva.repository";
import { DepositoGarantia, FiltrosReserva, NuevaReserva, NuevoArticuloReserva, Reserva } from "src/dominio/entidades";

export class ReservaMemoriaRepository implements ReservaRepository {

    private proximoId = 3;
    private proximoIdArticulos = 6;
    private proximoIdDireccion = 1;
    private proximoGarantiaId = 3;

    async listar(filtros: FiltrosReserva): Promise<Reserva[]> {
        return [...RESERVAS.values()].filter((r) => {
            if (filtros.nombreCliente) {
                const nombre = filtros.nombreCliente.toLowerCase();
                const clientesEncontrados = [...CLIENTES.values()].filter((c) => c.nombre.toLowerCase().includes(nombre));
                if (clientesEncontrados.length === 0) return false;
            }

            if (filtros.fechaEntrega && r.fechaEntrega !== filtros.fechaEntrega) return false;
            if (filtros.fechaRecoleccion && r.fechaRecoleccion !== filtros.fechaRecoleccion) return false;
            if (filtros.estado && r.estado !== filtros.estado) return false;
            return true;
        });
    }

    async buscarPorId(id: number): Promise<Reserva | null> {
        const reserva = RESERVAS.get(id);
        return (reserva) ? reserva : null;
    }

    async buscarPorFolio(folio: string): Promise<Reserva | null> {
        const reserva = [...RESERVAS.values()].find((r) => r.folio === folio);
        return (reserva) ? reserva : null;
    }

    async buscarPorCliente(clienteId: number): Promise<Reserva[]> {
        return [...RESERVAS.values()].filter((r) => r.clienteId === clienteId);
    }

    async crear(datosReserva: NuevaReserva, datosArticulos: NuevoArticuloReserva[]): Promise<Reserva> {
        // Se contruye la nueva reserva
        const id = this.proximoId++;
        const nuevaReserva: Reserva = {
            id,
            clienteId: datosReserva.clienteId,
            folio: datosReserva.folio,
            montoTotal: datosReserva.montoTotal,
            fechaEntrega: datosReserva.fechaEntrega,
            fechaRecoleccion: datosReserva.fechaRecoleccion,
            creadoEn: new Date(),
            estado: 'apartada',
            direccionEntrega: {
                id: this.proximoIdDireccion++,
                numero: datosReserva.numero,
                calle: datosReserva.calle,
                colonia: datosReserva.colonia
            }
        };
        // Se contruye y se guarda el nuevo depósito de garantía
        const depositoGarantia: DepositoGarantia = {
            id: this.proximoGarantiaId++,
            reservaId: nuevaReserva.id,
            monto: datosReserva.montoGarantia,
            confirmado: false,
            devuelto: false
        };
        DEPOSITOS_GARANTIA.set(depositoGarantia.id, depositoGarantia);
        // Se contruyen y se guardan los artículos reservados
        datosArticulos.forEach((a) => {
            const id = this.proximoIdArticulos++;
            const nuevoArticuloReserva = {
                id,
                articuloId: a.articuloId,
                reservaId: nuevaReserva.id,
                cantidad: a.cantidad,
                precioUnitario: a.precioUnitario,
                subtotal: a.subtotal
            };
            ARTICULOS_RESERVA.set(id, nuevoArticuloReserva);
        });
        // Finalmente, se guarda la nueva reserva
        RESERVAS.set(id, nuevaReserva);
        return nuevaReserva;
    }

    async entregar(id: number): Promise<Reserva | null> {
        const reserva = RESERVAS.get(Number(id));
        if (!reserva) return null;
        reserva.estado = 'entregada';
        RESERVAS.set(reserva.id, reserva);
        return reserva;
    }

    async recolectar(id: number): Promise<Reserva | null> {
        const reserva = RESERVAS.get(Number(id));
        if (!reserva) return null;
        reserva.estado = 'devuelta';
        RESERVAS.set(reserva.id, reserva);
        return reserva;
    }

    async cancelar(id: number): Promise<Reserva | null> {
        const reserva = RESERVAS.get(Number(id));
        if (!reserva) return null;
        
        // Aprueba la solicitud asociada a la reserva (si existe)
        const solicitud = [...SOLICITUDES_CANCELACION.values()].find((s) => s.reservadId === reserva.id);
        if (solicitud) {
            solicitud.estadoSolicitud = "aprovada";
            SOLICITUDES_CANCELACION.set(solicitud.id, solicitud);
        }

        reserva.estado = 'cancelada';
        RESERVAS.set(reserva.id, reserva);
        return reserva;
    }
}