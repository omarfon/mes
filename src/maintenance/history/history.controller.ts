import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { MaintenanceHistoryService } from './history.service';

@ApiTags('Maintenance History')
@Controller('maintenance/history')
export class MaintenanceHistoryController {
  constructor(private readonly historyService: MaintenanceHistoryService) {}

  @Get('asset/:assetId')
  @ApiOperation({ summary: 'Obtener historial de activo' })
  getAssetHistory(@Param('assetId') assetId: string) {
    return this.historyService.getAssetHistory(assetId);
  }

  @Get('work-order/:workOrderId')
  @ApiOperation({ summary: 'Obtener historial de orden de trabajo' })
  getWorkOrderHistory(@Param('workOrderId') workOrderId: string) {
    return this.historyService.getWorkOrderHistory(workOrderId);
  }

  @Get('interventions')
  @ApiOperation({ summary: 'Obtener historial de intervenciones' })
  getInterventionHistory(@Query() filters: any) {
    return this.historyService.getInterventionHistory(filters);
  }

  @Get('downtime')
  @ApiOperation({ summary: 'Obtener historial de paradas' })
  getDowntimeHistory(@Query() filters: any) {
    return this.historyService.getDowntimeHistory(filters);
  }
}
