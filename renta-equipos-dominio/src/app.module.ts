import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { InventarioModule } from './inventario/inventario.module';
import { OperacionesModule } from './operaciones/operaciones.module';
import { ReservasModule } from './reservas/reservas.module';
import { DisponibilidadModule } from './disponibilidad/disponibilidad.module';
import { PrismaModule } from './prisma/prisma.module';
import { PeticionIdMiddleware } from './comun/middleware/peticion-id.middleware';

@Module({
  imports: [UsuariosModule, InventarioModule, OperacionesModule, ReservasModule, DisponibilidadModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PeticionIdMiddleware).forRoutes('*');
  }
}
