import { Module } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { DEPOSITO_GARANTIA_REPOSITORY, RESERVA_REPOSITORY, SOLICITUD_CANCELACION_REPOSITORY } from './reservas.tokens';
import { ARTICULO_REPOSITORY } from 'src/inventario/inventario.tokens';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { InventarioModule } from 'src/inventario/inventario.module';
import { DisponibilidadModule } from 'src/disponibilidad/disponibilidad.module';
import { ReservasController } from './reservas.controller';
import { ReservaPrismaRepository } from './infra/reserva.prisma.repository';
import { ArticuloReservaPrismaRepository } from './infra/articulo.reserva.prisma.repository';
import { DepositoGarantiaPrismaRepository } from './infra/deposito.garantia.prisma.repository';
import { SolicitudCancelacionPrismaRepository } from './infra/solicitud.cancelacion.prisma.repository';

@Module({
  imports: [UsuariosModule, InventarioModule, DisponibilidadModule],
  providers: [ReservasService, {
    provide: RESERVA_REPOSITORY,
    useClass: ReservaPrismaRepository
  }, {
    provide: ARTICULO_REPOSITORY,
    useClass: ArticuloReservaPrismaRepository
  },{
    provide: DEPOSITO_GARANTIA_REPOSITORY,
    useClass: DepositoGarantiaPrismaRepository
  }, {
    provide: SOLICITUD_CANCELACION_REPOSITORY,
    useClass: SolicitudCancelacionPrismaRepository
  }],
  exports: [ReservasService],
  controllers: [ReservasController]
})
export class ReservasModule {}
