import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { MaintenanceReportsService } from './reports.service';

@ApiTags('Maintenance Reports')
@Controller('maintenance/reports')
export class MaintenanceReportsController {
  constructor(private readonly reportsService: MaintenanceReportsService) {}

  @Get('mtbf')
  @ApiOperation({ summary: 'Generar reporte MTBF (Mean Time Between Failures)' })
  generateMTBFReport(@Query('assetId') assetId?: string) {
    return this.reportsService.generateMTBFReport(assetId);
  }

  @Get('mttr')
  @ApiOperation({ summary: 'Generar reporte MTTR (Mean Time To Repair)' })
  generateMTTRReport(@Query('assetId') assetId?: string) {
    return this.reportsService.generateMTTRReport(assetId);
  }

  @Get('availability')
  @ApiOperation({ summary: 'Generar reporte de disponibilidad' })
  generateAvailabilityReport(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.reportsService.generateAvailabilityReport(new Date(startDate), new Date(endDate));
  }

  @Get('cost-analysis')
  @ApiOperation({ summary: 'Generar análisis de costos' })
  generateCostAnalysis(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.reportsService.generateCostAnalysis(new Date(startDate), new Date(endDate));
  }

  @Get('compliance')
  @ApiOperation({ summary: 'Generar reporte de cumplimiento' })
  generateComplianceReport() {
    return this.reportsService.generateComplianceReport();
  }
}
