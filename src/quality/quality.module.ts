import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QualityInspection } from './entities/inspection.entity';
import { Defect } from './entities/defect.entity';
import { InspectionDefect } from './entities/inspection-defect.entity';
import { TraceNode } from '../traceability/entities/trace-node.entity';

// New sub-modules
import { DefectsModule } from './defects/defects.module';
import { FamiliesModule } from './families/families.module';
import { InspectionsModule } from './inspections/inspections.module';
import { SeveritiesModule } from './severities/severities.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QualityInspection,
      Defect,
      InspectionDefect,
      TraceNode,
    ]),
    // New sub-modules
    DefectsModule,
    FamiliesModule,
    InspectionsModule,
    SeveritiesModule,
    DashboardModule,
  ],
  exports: [
    DefectsModule,
    FamiliesModule,
    InspectionsModule,
    SeveritiesModule,
    DashboardModule,
  ],
})
export class QualityModule {}
