import { Module } from '@nestjs/common';
import { InventarioService } from './inventario.service';
import { ArticuloMemoriaRepository } from './infra/articulo.memoria.repository';
import { AJUSTE_EXISTENCIA_REPOSITORY, ARTICULO_REPOSITORY, PIEZAS_MANTENIMIENTO_REPOSITORY } from './inventario.tokens';
import { AjusteExistenciaMemoriaRepository } from './infra/ajuste.existencia.memoria.repository';
import { PiezasMantenimientoMemoriaRepository } from './infra/piezas.mantenimiento.memoria.repository';

@Module({
  providers: [InventarioService, {
    provide: ARTICULO_REPOSITORY,
    useClass: ArticuloMemoriaRepository
  }, {
    provide: AJUSTE_EXISTENCIA_REPOSITORY,
    useClass: AjusteExistenciaMemoriaRepository
  }, {
    provide: PIEZAS_MANTENIMIENTO_REPOSITORY,
    useClass: PiezasMantenimientoMemoriaRepository
  }],
  exports: [InventarioService]
})
export class InventarioModule {}
