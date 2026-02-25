import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { MaintenanceDashboardService } from './dashboard.service';

@ApiTags('Maintenance Dashboard')
@Controller('maintenance/dashboard')
export class MaintenanceDashboardController {
  constructor(private readonly dashboardService: MaintenanceDashboardService) {}

  @Get('kpis')
  @ApiOperation({ summary: 'Obtener KPIs de mantenimiento' })
  getKPIs() {
    return this.dashboardService.getKPIs();
  }

  @Get('trends')
  @ApiOperation({ summary: 'Obtener tendencias de mantenimiento' })
  getTrends(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.dashboardService.getMaintenanceTrends(new Date(startDate), new Date(endDate));
  }

  @Get('downtime-analysis')
  @ApiOperation({ summary: 'Obtener análisis de paradas' })
  getDowntimeAnalysis() {
    return this.dashboardService.getDowntimeAnalysis();
  }
}
