import { Module } from '@nestjs/common';
import { MaintenanceDashboardController } from './dashboard.controller';
import { MaintenanceDashboardService } from './dashboard.service';

@Module({
  imports: [],
  controllers: [MaintenanceDashboardController],
  providers: [MaintenanceDashboardService],
  exports: [MaintenanceDashboardService],
})
export class MaintenanceDashboardModule {}
