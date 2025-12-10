import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MasterDataModule } from './master-data/master-data.module';
import { ProductionOrdersModule } from './production-orders/production-orders.module';
import { DispatchingModule } from './dispatching/dispatching.module';
import { DataCollectionModule } from './data-collection/data-collection.module';

@Module({
  imports: [AuthModule, UsersModule, MasterDataModule, ProductionOrdersModule, DispatchingModule, DataCollectionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
