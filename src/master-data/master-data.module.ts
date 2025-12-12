import { Module } from '@nestjs/common';
import { MachinesController } from './machines/controllers/machines.controller';
import { UsersController } from 'src/users/users.controller';
import { ProductsController } from './products/products.controller';
import { WorkCentersController } from './work-centers/work-centers.controller';
import { SchiftController } from './schift/schift.controller';
import { ProductsModule } from './products/products.module';
import { MachinesModule } from './machines/machines.module';
import { UsersModule } from 'src/users/users.module';



@Module({
  imports:[MachinesModule,
          UsersModule,
          ProductsModule],
  controllers: [
                MachinesController, 
                UsersController, 
                ProductsController, 
                WorkCentersController, 
                SchiftController],
  providers: [],
})
export class MasterDataModule {}
