import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MasterDataModule } from './master-data/master-data.module';
import { ProductionOrdersModule } from './production-orders/production-orders.module';
import { DispatchingModule } from './dispatching/dispatching.module';
import { DataCollectionModule } from './data-collection/data-collection.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { QualityModule } from './quality/quality.module';
import { TraceabilityModule } from './traceability/traceability.module';
import { ReportsModule } from './reports/reports.module';
import { IntegrationModule } from './integration/integration.module';
import { IotIngestionModule } from './iot-ingestion/iot-ingestion.module';

@Module({
  imports:  [  TypeOrmModule.forRoot({
      // config de conexión a DB
    }),AuthModule, UsersModule, MasterDataModule, ProductionOrdersModule, DispatchingModule, DataCollectionModule, MonitoringModule, QualityModule, TraceabilityModule, ReportsModule, IntegrationModule, IotIngestionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
