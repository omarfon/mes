import { Module } from '@nestjs/common';
import { MaintenanceReportsController } from './reports.controller';
import { MaintenanceReportsService } from './reports.service';

@Module({
  imports: [],
  controllers: [MaintenanceReportsController],
  providers: [MaintenanceReportsService],
  exports: [MaintenanceReportsService],
})
export class MaintenanceReportsModule {}
