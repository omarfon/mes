import { Module } from '@nestjs/common';
import { MaintenanceDashboardModule } from './dashboard/dashboard.module';
import { AssetsModule } from './assets/assets.module';
import { ComponentsModule } from './components/components.module';
import { WorkOrdersModule } from './work-orders/work-orders.module';
import { DowntimeModule } from './downtime/downtime.module';
import { CalendarModule } from './calendar/calendar.module';
import { PreventiveMaintenanceModule } from './preventive-maintenance/preventive-maintenance.module';
import { InterventionsModule } from './interventions/interventions.module';
import { SparePartsModule } from './spare-parts/spare-parts.module';
import { MaintenanceHistoryModule } from './history/history.module';
import { MaintenanceReportsModule } from './reports/reports.module';

@Module({
  imports: [
    MaintenanceDashboardModule,
    AssetsModule,
    ComponentsModule,
    WorkOrdersModule,
    DowntimeModule,
    CalendarModule,
    PreventiveMaintenanceModule,
    InterventionsModule,
    SparePartsModule,
    MaintenanceHistoryModule,
    MaintenanceReportsModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class MaintenanceModule {}
