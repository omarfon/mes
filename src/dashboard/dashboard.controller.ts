import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('kpis')
  @ApiOperation({ summary: 'Obtener KPIs principales del dashboard' })
  async getKPIs() {
    return this.dashboardService.getKPIs();
  }

  @Get('production-trend')
  @ApiOperation({ summary: 'Obtener tendencia de producción de los últimos días' })
  @ApiQuery({ name: 'days', required: false, type: Number, description: 'Número de días (default: 7)' })
  async getProductionTrend(
    @Query('days', new ParseIntPipe({ optional: true })) days?: number,
  ) {
    return this.dashboardService.getProductionTrend(days || 7);
  }

  @Get('orders-by-status')
  @ApiOperation({ summary: 'Obtener resumen de órdenes agrupadas por estado' })
  async getOrdersByStatus() {
    return this.dashboardService.getOrdersByStatus();
  }
}
