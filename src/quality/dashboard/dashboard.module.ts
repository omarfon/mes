import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { DefectsModule } from '../defects/defects.module';
import { InspectionsModule } from '../inspection/inspection.module';
import { SeveritiesModule } from '../severities/severities.module';
import { FamiliesModule } from '../families/families.module';

@Module({
  imports: [DefectsModule, InspectionsModule, SeveritiesModule, FamiliesModule],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
