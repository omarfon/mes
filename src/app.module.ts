import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './master-data/users/users.module';
import { MasterDataModule } from './master-data/master-data.module';
import { ProductionModule } from './production/production.module';
import { ProductionOrdersModule } from './production-orders/production-orders.module';
import { DispatchingModule } from './dispatching/dispatching.module';
import { DataCollectionModule } from './data-collection/data-collection.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { QualityModule } from './quality/quality.module';
import { TraceabilityModule } from './traceability/traceability.module';
import { ReportsModule } from './reports/reports.module';
import { IntegrationModule } from './integration/integration.module';
import { IotIngestionModule } from './iot-ingestion/iot-ingestion.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DashboardModule } from './dashboard/dashboard.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ActivityLogModule } from './activity-log/activity-log.module';
import { AssetsStatusModule } from './assets-status/assets-status.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
import databaseConfig from './config/database-config';

@Module({
  imports:  [  
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory:  (config: ConfigService) :
        TypeOrmModuleOptions => ({
          type: 'postgres',
          host: config.get<string>('DB_HOST'),
          port: parseInt(config.get<string>('DB_PORT') ?? '5432', 10),
          database: config.get<string>('DB_NAME'),
          username: config.get<string>('DB_USER'),
          password: config.get<string>('DB_PASSWORD'),
          autoLoadEntities: true,
          synchronize: false, // Deshabilitado temporalmente para evitar bucle de schema sync
          logging: config.get<string>('DB_LOGGING') === 'true',
        }),
    }), 
    AuthModule, 
        UsersModule, 
        MasterDataModule,
        ProductionModule,
        ProductionOrdersModule, 
        DispatchingModule, 
        DataCollectionModule, 
        MonitoringModule, 
        QualityModule, 
        MaintenanceModule,
        TraceabilityModule, 
        ReportsModule, 
        IntegrationModule, 
        IotIngestionModule, DashboardModule, NotificationsModule, ActivityLogModule, AssetsStatusModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
