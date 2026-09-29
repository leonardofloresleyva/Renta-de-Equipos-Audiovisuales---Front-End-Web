import { Injectable, Inject } from '@nestjs/common';
import { CrearArticuloDto } from '../dto/crear.articulo.dto';
import { Articulo } from '../dominio/entidades'; // Ajusta tu import real
import type { ArticuloRepository } from 'src/dominio/articulo.repository';
import { ADMIN_REPOSITORY, ARTICULO_REPOSITORY, RESERVA_REPOSITORY } from './articulos.tokens';
import type { ReservaRepository } from 'src/dominio/reserva.repository';
import type { AdminRepository } from 'src/dominio/admin.repository';

@Injectable()
export class ArticulosService {
  constructor(
    @Inject(ARTICULO_REPOSITORY) 
    private readonly articuloRepo: ArticuloRepository,
    @Inject(RESERVA_REPOSITORY)
    private readonly reservasRepo: ReservaRepository,
    @Inject(ADMIN_REPOSITORY)
    private readonly adminRepo: AdminRepository
  ) {}

  listar(): Promise<Articulo[]> {
    return this.articuloRepo.listar();
  }

  buscarPorId(id: number): Promise<Articulo | null> {
    return this.articuloRepo.buscarPorId(id);
  }

  crear(dto: CrearArticuloDto): Promise<Articulo> {
    return this.articuloRepo.crear({
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      precioPorDia: dto.precioPorDia,
      existencias: dto.existencias,
      categoria: dto.categoria,
      fotografiasUrl: dto.fotografiasUrl
    });
  }

  // REGLA DE NEGOCIO 07
  async obtenerDisponibilidad(id: number, fechaInicio: Date, fechaFin: Date): Promise<number> {
    let cantidadDisponible = 0;
    const piezasReservadas = await this.reservasRepo.obtenerPiezasReservadasPeriodo(id, fechaInicio, fechaFin);
    const piezasMantenimiento = await this.adminRepo.obtenerCantidadPiezasMantenimientoPeriodo(id, fechaInicio, fechaFin);
    cantidadDisponible -= (piezasMantenimiento + piezasReservadas);
    return (cantidadDisponible > 0) ? cantidadDisponible: 0;
  }

}