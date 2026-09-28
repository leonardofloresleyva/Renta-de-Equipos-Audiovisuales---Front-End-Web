import type { ActualizarClienteDto } from '../dto/actualizar-cliente.dto';
import type { CrearClienteDto } from '../dto/crear-cliente.dto';
import type { Cliente } from './entidades';

export interface ClienteRepository {
  listar(): Promise<Cliente[]>;
  buscarPorId(id: number): Promise<Cliente | null>;
  crear(datos: CrearClienteDto): Promise<Cliente>;
  actualizar(id: number, datos: ActualizarClienteDto): Promise<Cliente | null>;
  eliminar(id: number): Promise<Cliente | null>;
}
