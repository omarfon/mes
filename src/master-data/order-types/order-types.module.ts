import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderType } from './entities/order-type.entity';
import { OrderTypesController } from './order-types.controller';
import { OrderTypesService } from './order-types.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderType])],
  controllers: [OrderTypesController],
  providers: [OrderTypesService],
  exports: [OrderTypesService, TypeOrmModule],
})
export class OrderTypesModule {}
