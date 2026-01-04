import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { DashboardService } from './dashboard.service';

@ApiTags('Quality - Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('quality/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('kpis')
  getQualityKPIs() {
    return this.dashboardService.getQualityKPIs();
  }

  @Get('defects-analysis')
  getDefectsAnalysis() {
    return this.dashboardService.getDefectsAnalysis();
  }

  @Get('inspections-analysis')
  getInspectionsAnalysis() {
    return this.dashboardService.getInspectionsAnalysis();
  }

  @Get('complete')
  getCompleteDashboard() {
    return this.dashboardService.getCompleteDashboard();
  }
}
