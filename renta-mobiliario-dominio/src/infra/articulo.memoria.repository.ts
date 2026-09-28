import { Injectable } from '@nestjs/common';
import type { ArticuloRepository } from '../dominio/articulo.repository';
import type { Articulo } from '../dominio/entidades';

@Injectable()
export class ArticuloMemoriaRepository implements ArticuloRepository {
  private articulos = new Map<number, Articulo>([
    [
      1,
      {
        id: 1,
        nombre: 'Proyector Láser Epson Pro L1070U 7000 Lúmenes WUXGA',
        descripcion: 'Proyector láser profesional de alta luminosidad, resolución 1920x1200 con tecnología 3LCD.',
        precioPorDia: 1500,
        existencias: 8,
        categoria: 'Proyectores',
        fotografiasUrl: [
          'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80',
        ],
      },
    ],
    [
      2,
      {
        id: 2,
        nombre: 'Pantalla Inflable Gigante 6x4m con Motor Silencioso',
        descripcion: 'Pantalla gigante para proyecciones al aire libre o salones amplios.',
        precioPorDia: 900,
        existencias: 4,
        categoria: 'Pantallas',
        fotografiasUrl: [
          'https://images.unsplash.com/photo-1574267432553-4b4628081c31?auto=format&fit=crop&w=800&q=80',
        ],
      },
    ],
    [
      3,
      {
        id: 3,
        nombre: 'Bafle Activo JBL EON715 15" Bluetooth 1300W',
        descripcion: 'Bafle profesional autoamplificado de 1300W pico con DSP integrado.',
        precioPorDia: 400,
        existencias: 16,
        categoria: 'Audio',
        fotografiasUrl: [
          'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
        ],
      },
    ],
    [
      4,
      {
        id: 4,
        nombre: 'Sistema Micrófonos Inalámbricos Doble Shure BLX288/PG58',
        descripcion: 'Sistema inalámbrico dual de mano con cápsulas PG58, alcance de hasta 100m.',
        precioPorDia: 350,
        existencias: 10,
        categoria: 'Audio',
        fotografiasUrl: [
          'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80',
        ],
      },
    ],
    [
      5,
      {
        id: 5,
        nombre: 'Cabezas Móviles Beam 7R 230W DMX 512',
        descripcion: 'Iluminación robótica profesional con rueda de colores y prismas giratorios.',
        precioPorDia: 550,
        existencias: 32,
        categoria: 'Iluminación',
        fotografiasUrl: [
          'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
        ],
      },
    ],
  ]);

  private proximoId = 6;

  async listar(): Promise<Articulo[]> {
    return Array.from(this.articulos.values()).map((art) => ({
      ...art,
      fotografiasUrl: [...art.fotografiasUrl],
    }));
  }

  async buscarPorId(id: number): Promise<Articulo | null> {
    const articulo = this.articulos.get(Number(id));
    if (!articulo) return null;
    return {
      ...articulo,
      fotografiasUrl: [...articulo.fotografiasUrl],
    };
  }

  async crear(datos: Omit<Articulo, 'id'>): Promise<Articulo> {
    const id = this.proximoId++;
    const nuevoArticulo: Articulo = {
      id,
      ...datos,
      fotografiasUrl: [...(datos.fotografiasUrl || [])],
    };
    this.articulos.set(id, nuevoArticulo);
    return {
      ...nuevoArticulo,
      fotografiasUrl: [...nuevoArticulo.fotografiasUrl],
    };
  }

  async actualizar(id: number, datos: Partial<Articulo>): Promise<Articulo | null> {
    const articuloExistente = this.articulos.get(Number(id));
    if (!articuloExistente) {
      return null;
    }
    const articuloActualizado: Articulo = {
      ...articuloExistente,
      ...datos,
      id: articuloExistente.id,
      fotografiasUrl: datos.fotografiasUrl
        ? [...datos.fotografiasUrl]
        : [...articuloExistente.fotografiasUrl],
    };
    this.articulos.set(Number(id), articuloActualizado);
    return {
      ...articuloActualizado,
      fotografiasUrl: [...articuloActualizado.fotografiasUrl],
    };
  }

  async eliminar(id: number): Promise<Articulo | null> {
    const articulo = this.articulos.get(Number(id));
    if (!articulo) {
      return null;
    }
    this.articulos.delete(Number(id));
    return {
      ...articulo,
      fotografiasUrl: [...articulo.fotografiasUrl],
    };
  }
}
