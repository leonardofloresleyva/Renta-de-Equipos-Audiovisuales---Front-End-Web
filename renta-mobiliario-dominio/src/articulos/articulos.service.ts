import { Injectable, Inject } from '@nestjs/common';
import { CrearArticuloDto } from '../dto/crear.articulo.dto';
import { Articulo } from '../dominio/entidades'; // Ajusta tu import real

@Injectable()
export class ArticulosService {
  constructor(
    @Inject('IArticuloRepository') 
    private readonly articuloRepository: any 
  ) {}

  async crear(dto: CrearArticuloDto): Promise<any> {
    const nuevoArticulo = new Articulo(
      dto.nombre,
      dto.descripcion,
      dto.precioPorDia,
      dto.existencias,
      dto.categoria,       // Dato agregado
      dto.fotografiasUrl   // Atributo corregido
    );

    return await this.articuloRepository.guardar(nuevoArticulo);
  }
}