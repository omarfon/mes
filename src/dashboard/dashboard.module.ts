import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { ProductionOrder } from '../production-orders/entities/production-order.entity';
import { Machine } from '../master-data/machines/entities/machines.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductionOrder, Machine]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
