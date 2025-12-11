import { Module } from '@nestjs/common';
import { MasterDataService } from './master-data.service';
import { MasterDataController } from './master-data.controller';
import { MachinesController } from './machines/controllers/machines.controller';
import { ProductsController } from './controllers/products.controller';
import { WorkCentersController } from './controllers/work-centers.controller';
import { SchiftController } from './controllers/schift.controller';



@Module({
  controllers: [MasterDataController, MachinesController, ProductsController, WorkCentersController, SchiftController],
  providers: [MasterDataService],
})
export class MasterDataModule {}
