import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReservasModule } from './reservas/reservas.module';
import { ArticulosModule } from './articulos/articulos.module';
import { ClientesModule } from './clientes/clientes.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [ReservasModule, ArticulosModule, ClientesModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
