import { PartialType } from '@nestjs/mapped-types';
import { CreateProductionOrderDto } from './create-production-order.dto';
import { IsEnum, IsOptional } from 'class-validator';
import {
  ProductionOrderStatus,
} from '../entities/production-order.entity';

export class UpdateProductionOrderDto extends PartialType(
  CreateProductionOrderDto,
) {
  /**
   * Actualizar estado de la orden explícitamente (opcional)
   */
  @IsOptional()
  @IsEnum(ProductionOrderStatus)
  status?: ProductionOrderStatus;
}
