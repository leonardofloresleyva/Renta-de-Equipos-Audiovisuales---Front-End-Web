import { Module } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { DEPOSITO_GARANTIA_REPOSITORY, RESERVA_REPOSITORY, SOLICITUD_CANCELACION_REPOSITORY } from './reservas.tokens';
import { ReservaMemoriaRepository } from './infra/reserva.memoria.repository';
import { DepositoGarantiaMemoriaRepository } from './infra/deposito.garantia.memoria.repository';
import { ARTICULO_REPOSITORY } from 'src/inventario/inventario.tokens';
import { ArticuloReservaMemoriaRepository } from './infra/articulo.reserva.memoria.repository';
import { SolicitudCancelacionMemoriaRepository } from './infra/solicitud.cancelacion.memoria.repository';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { InventarioModule } from 'src/inventario/inventario.module';
import { DisponibilidadModule } from 'src/disponibilidad/disponibilidad.module';

@Module({
  imports: [UsuariosModule, InventarioModule, DisponibilidadModule],
  providers: [ReservasService, {
    provide: RESERVA_REPOSITORY,
    useClass: ReservaMemoriaRepository
  }, {
    provide: ARTICULO_REPOSITORY,
    useClass: ArticuloReservaMemoriaRepository
  },{
    provide: DEPOSITO_GARANTIA_REPOSITORY,
    useClass: DepositoGarantiaMemoriaRepository
  }, {
    provide: SOLICITUD_CANCELACION_REPOSITORY,
    useClass: SolicitudCancelacionMemoriaRepository
  }],
  exports: [ReservasService]
})
export class ReservasModule {}
