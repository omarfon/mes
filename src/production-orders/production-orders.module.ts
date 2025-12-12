import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductionOrder } from './entities/production-order.entity';

import { Route } from '../master-data/routes/entities/route.entity';
import { RouteOperation } from '../master-data/routes/entities/route-operation.entity';
import { Product } from '../master-data/products/entities/product.entity';
import { ProductionOrderOperation } from './entities/product-order-operation.entity';
import { ProductionOrdersController } from './production-orders.controller';
import { ProductionOrdersService } from './production-orders.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductionOrder,
      ProductionOrderOperation,
      Route,
      RouteOperation,
      Product,
    ]),
  ],
  controllers: [ProductionOrdersController],
  providers: [ProductionOrdersService],
  exports: [ProductionOrdersService, TypeOrmModule],
})
export class ProductionOrdersModule {}
