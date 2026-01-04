import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenProduccion } from './entities/orden.entity';
import { Product } from '../../master-data/products/entities/product.entity';
import { OrdenesService } from './ordenes.service';
import { OrdenesController } from './ordenes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OrdenProduccion, Product])],
  controllers: [OrdenesController],
  providers: [OrdenesService],
  exports: [OrdenesService, TypeOrmModule],
})
export class OrdenesModule {}