import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { InventarioModule } from './inventario/inventario.module';
import { OperacionesModule } from './operaciones/operaciones.module';
import { ReservasModule } from './reservas/reservas.module';
import { DisponibilidadModule } from './disponibilidad/disponibilidad.module';

@Module({
  imports: [UsuariosModule, InventarioModule, OperacionesModule, ReservasModule, DisponibilidadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
