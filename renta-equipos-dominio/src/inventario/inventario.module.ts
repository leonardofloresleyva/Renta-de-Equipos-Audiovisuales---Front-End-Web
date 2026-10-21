import { Module } from '@nestjs/common';
import { InventarioService } from './inventario.service';
import { ArticuloPrismaRepository } from './infra/articulo.prisma.repository';
import { AJUSTE_EXISTENCIA_REPOSITORY, ARTICULO_REPOSITORY, PIEZAS_MANTENIMIENTO_REPOSITORY } from './inventario.tokens';
import { AjusteExistenciaPrismaRepository } from './infra/ajuste.existencia.prisma.repository';
import { PiezasMantenimientoPrismaRepository } from './infra/piezas.mantenimiento.prisma.repository';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { ReservasModule } from 'src/reservas/reservas.module';
import { DisponibilidadModule } from 'src/disponibilidad/disponibilidad.module';
import { InventarioController } from './inventario.controller';

@Module({
  imports: [UsuariosModule, DisponibilidadModule],
  providers: [InventarioService, {
    provide: ARTICULO_REPOSITORY,
    useClass: ArticuloPrismaRepository
  }, {
    provide: AJUSTE_EXISTENCIA_REPOSITORY,
    useClass: AjusteExistenciaPrismaRepository
  }, {
    provide: PIEZAS_MANTENIMIENTO_REPOSITORY,
    useClass: PiezasMantenimientoPrismaRepository
  }],
  exports: [InventarioService],
  controllers: [InventarioController]
})
export class InventarioModule {}
