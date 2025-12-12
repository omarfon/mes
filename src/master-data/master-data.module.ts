import { Module } from '@nestjs/common';
import { MachinesController } from './machines/controllers/machines.controller';
import { UsersController } from 'src/users/users.controller';
import { ProductsController } from './products/products.controller';
import { WorkCentersController } from './work-centers/work-centers.controller';
import { ProductsModule } from './products/products.module';
import { MachinesModule } from './machines/machines.module';
import { UsersModule } from 'src/users/users.module';
import { RoutesModule } from './routes/routes.module';
import { ShiftsModule } from './schift/schift.module';
import { WorkCentersModule } from './work-centers/work-centers.module';



@Module({
  imports:[MachinesModule,
          UsersModule,
          ProductsModule,
          RoutesModule,
          ShiftsModule,
          WorkCentersModule],
  controllers: [
                MachinesController, 
                ProductsController, 
                WorkCentersController, 
                ],
  providers: [],
})
export class MasterDataModule {}
