export class FiltrosSolicitudesDto {
    fechaInicio?: Date;
    fechaFin?: Date;
    estado?: 'pendiente' | 'aprovada' | 'rechazada';
}