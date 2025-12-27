import { Module } from '@nestjs/common';
import { MachinesController } from './machines/controllers/machines.controller';
import { ProductsController } from './products/products.controller';
import { WorkCentersController } from './work-centers/work-centers.controller';
import { ProductsModule } from './products/products.module';
import { MachinesModule } from './machines/machines.module';
import { RoutesModule } from './routes/routes.module';
import { ShiftsModule } from './schift/schift.module';
import { WorkCentersModule } from './work-centers/work-centers.module';
import { UsersModule } from './users/users.module';
import { TurnosModule } from './turnos/turnos.module';
import { UnidadesMedidaModule } from './unidades-medida/unidades-medida.module';
import { OperadoresModule } from './operadores/operadores.module';
import { MotivosParadaModule } from './motivos-parada/motivos-parada.module';
import { ProcesosModule } from './procesos/procesos.module';



@Module({
  imports:[MachinesModule,
          UsersModule,
          ProductsModule,
          RoutesModule,
          ShiftsModule,
          WorkCentersModule,
          TurnosModule,
          UnidadesMedidaModule,
          OperadoresModule,
          MotivosParadaModule,
          ProcesosModule],
  controllers: [
                MachinesController, 
                ProductsController, 
                WorkCentersController, 
                ],
  providers: [],
})
export class MasterDataModule {}
