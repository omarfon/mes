import { Injectable } from '@nestjs/common';
import { DefectsService } from '../defects/defects.service';
import { InspectionsService } from '../inspection/inspection.service';
import { SeveritiesService } from '../severities/severities.service';
import { FamiliesService } from '../families/families.service';

@Injectable()
export class DashboardService {
  constructor(
    private defectsService: DefectsService,
    private inspectionsService: InspectionsService,
    private severitiesService: SeveritiesService,
    private familiesService: FamiliesService,
  ) {}

  async getQualityKPIs(): Promise<any> {
    const defects = await this.defectsService.findAll();
    const inspectionsResult = await this.inspectionsService.findAll({});
    const inspections = inspectionsResult.data;

    const totalDefects = defects.length;
    const openDefects = defects.filter((d) => d.status === 'OPEN').length;
    const resolvedDefects = defects.filter((d) => d.status === 'RESOLVED').length;

    const totalInspections = inspections.length;
    const approvedInspections = inspections.filter((i) => i.status === 'PASSED').length;
    const rejectedInspections = inspections.filter((i) => i.status === 'FAILED').length;

    const approvalRate =
      totalInspections > 0 ? ((approvedInspections / totalInspections) * 100).toFixed(2) : 0;

    return {
      totalDefects,
      openDefects,
      resolvedDefects,
      totalInspections,
      approvedInspections,
      rejectedInspections,
      approvalRate: parseFloat(approvalRate as string),
      defectResolutionRate:
        totalDefects > 0 ? ((resolvedDefects / totalDefects) * 100).toFixed(2) : 0,
    };
  }

  async getDefectsAnalysis(): Promise<any> {
    const byFamily = await this.defectsService.getDefectsByFamily();
    const bySeverity = await this.defectsService.getDefectsBySeverity();

    return {
      byFamily,
      bySeverity,
    };
  }

  async getInspectionsAnalysis(): Promise<any> {
    const inspectionsResult = await this.inspectionsService.findAll({});
    const inspections = inspectionsResult.data;

    // Agrupar por tipo
    const byType = inspections.reduce((acc, insp) => {
      acc[insp.type] = (acc[insp.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Agrupar por resultado
    const byResult = inspections.reduce((acc, insp) => {
      acc[insp.status] = (acc[insp.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      byType,
      byResult,
    };
  }

  async getCompleteDashboard(): Promise<any> {
    const kpis = await this.getQualityKPIs();
    const defectsAnalysis = await this.getDefectsAnalysis();
    const inspectionsAnalysis = await this.getInspectionsAnalysis();

    return {
      kpis,
      defects: defectsAnalysis,
      inspections: inspectionsAnalysis,
    };
  }
}
