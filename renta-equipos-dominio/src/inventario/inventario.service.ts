import { Inject, Injectable } from '@nestjs/common';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import type { ArticuloRepository } from './repositorios/articulo.repository';
import { AJUSTE_EXISTENCIA_REPOSITORY, ARTICULO_REPOSITORY, PIEZAS_MANTENIMIENTO_REPOSITORY } from './inventario.tokens';
import type { AjusteExistenciaRepository } from './repositorios/ajuste.existencia.repository';
import type { PiezasMantenimientoRepository } from './repositorios/piezas.mantenimiento.repository';

@Injectable()
export class InventarioService {

    constructor(
        private readonly usuariosService: UsuariosService,
        @Inject(ARTICULO_REPOSITORY)
        private readonly articuloRepo: ArticuloRepository,
        @Inject(AJUSTE_EXISTENCIA_REPOSITORY)
        private readonly ajusteRepo: AjusteExistenciaRepository,
        @Inject(PIEZAS_MANTENIMIENTO_REPOSITORY)
        private readonly piezasRepo: PiezasMantenimientoRepository
    ) {}
}
