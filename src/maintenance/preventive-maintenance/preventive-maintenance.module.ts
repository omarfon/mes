import { Module } from '@nestjs/common';
import { PreventiveMaintenanceController } from './preventive-maintenance.controller';
import { PreventiveMaintenanceService } from './preventive-maintenance.service';

@Module({
  imports: [],
  controllers: [PreventiveMaintenanceController],
  providers: [PreventiveMaintenanceService],
  exports: [PreventiveMaintenanceService],
})
export class PreventiveMaintenanceModule {}
