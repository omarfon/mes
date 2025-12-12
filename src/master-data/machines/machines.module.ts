import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Machine } from './entities/machines.entity';
import { WorkCenter } from './entities/work-center.entity';
import { MachinesController } from './controllers/machines.controller';
import { MachinesService } from './services/machines.service';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';
import { WorkCentersModule } from '../work-centers/work-centers.module';



@Module({
  imports: [
    TypeOrmModule.forFeature([Machine, WorkCenter]),
    UsersModule,
    ProductsModule,
    WorkCentersModule,
  ],
  controllers: [MachinesController],
  providers: [MachinesService],
  exports: [MachinesService, TypeOrmModule],
})
export class MachinesModule {}
