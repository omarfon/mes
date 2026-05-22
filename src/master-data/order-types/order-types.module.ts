import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderType } from './entities/order-type.entity';
import { OrderTypesController } from './order-types.controller';
import { OrderTypesService } from './order-types.service';

import { AuditsModule } from '../../traceability/audits/audits.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrderType]), AuditsModule],
  controllers: [OrderTypesController],
  providers: [OrderTypesService],
  exports: [OrderTypesService, TypeOrmModule],
})
export class OrderTypesModule {}
