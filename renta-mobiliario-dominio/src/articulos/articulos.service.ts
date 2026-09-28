import { Injectable, Inject } from '@nestjs/common';
import { CrearArticuloDto } from '../dto/crear.articulo.dto';
import { Articulo } from '../dominio/entidades'; // Ajusta tu import real
import type { ArticuloRepository } from 'src/dominio';
import { ARTICULO_REPOSITORY } from './articulos.tokens';

@Injectable()
export class ArticulosService {
  constructor(
    @Inject(ARTICULO_REPOSITORY) 
    private readonly articuloRepository: ArticuloRepository 
  ) {}

  listar(): Promise<Articulo[]> {
    return this.articuloRepository.listar();
  }

  buscarPorId(id: number): Promise<Articulo | null> {
    return this.articuloRepository.buscarPorId(id);
  }

  crear(dto: CrearArticuloDto): Promise<Articulo> {
    return this.articuloRepository.crear({
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      precioPorDia: dto.precioPorDia,
      existencias: dto.existencias,
      categoria: dto.categoria,
      fotografiasUrl: dto.fotografiasUrl
    });
  }

}