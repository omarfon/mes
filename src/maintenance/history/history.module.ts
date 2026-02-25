import { Module } from '@nestjs/common';
import { MaintenanceHistoryController } from './history.controller';
import { MaintenanceHistoryService } from './history.service';

@Module({
  imports: [],
  controllers: [MaintenanceHistoryController],
  providers: [MaintenanceHistoryService],
  exports: [MaintenanceHistoryService],
})
export class MaintenanceHistoryModule {}
