export class FiltrosReserva {
    nombreCliente?: string;
    fechaEntrega?: Date;
    fechaRecoleccion?: Date;
    estado?: 'apartada'| 'entregada'| 'devuelta' | 'cancelada';
}