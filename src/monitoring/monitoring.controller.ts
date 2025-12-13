import { Controller, Get, Post, Body, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { LogEventDto } from './dto/log-event.dto';

@Controller('monitoring')
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) { }

  /**
   * Endpoint para simular recepción de datos IoT
   * POST /monitoring/events
   */
  @Post('events')
  async logEvent(@Body() dto: LogEventDto) {
    return this.monitoringService.logEvent(dto);
  }

  /**
   * Dashboard de planta: Estado actual de todas las máquinas
   * GET /monitoring/dashboard
   */
  @Get('dashboard')
  async getDashboard() {
    return this.monitoringService.getPlantStatus();
  }

  /**
   * Historial de una máquina específica
   * GET /monitoring/history/:machineId
   */
  @Get('history/:machineId')
  async getHistory(
    @Param('machineId', new ParseUUIDPipe()) machineId: string,
    @Query('limit') limit?: number,
  ) {
    return this.monitoringService.getMachineHistory(machineId, limit);
  }
}
