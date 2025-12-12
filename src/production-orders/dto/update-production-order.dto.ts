import { PartialType } from '@nestjs/mapped-types';
import { CreateProductionOrderDto } from './create-production-order.dto';
import { IsEnum, IsOptional } from 'class-validator';
import {
  ProductionOrderStatus,
} from '../entities/production-order.entity';

export class UpdateProductionOrderDto extends PartialType(
  CreateProductionOrderDto,
) {
  @IsOptional()
  @IsEnum(ProductionOrderStatus)
  status?: ProductionOrderStatus;
}
