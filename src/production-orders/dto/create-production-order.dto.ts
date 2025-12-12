import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import {
  ProductionOrderPriority,
} from '../entities/production-order.entity';

export class CreateProductionOrderDto {
  @IsString()
  code: string; // podrías generar esto en backend si prefieres

  @IsOptional()
  @IsString()
  externalCode?: string;

  @IsUUID()
  productId: string;

  @IsUUID()
  routeId: string;

  @IsNumber()
  @Min(0.0001)
  quantityPlanned: number;

  @IsOptional()
  @IsEnum(ProductionOrderPriority)
  priority?: ProductionOrderPriority;

  @IsOptional()
  @IsUUID()
  mainWorkCenterId?: string;

  @IsOptional()
  @IsUUID()
  shiftId?: string;

  @IsOptional()
  @IsDateString()
  plannedStartDate?: string;

  @IsOptional()
  @IsDateString()
  plannedEndDate?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
