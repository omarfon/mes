import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  ProductionOrderPriority,
  ProductionOrderStatus,
} from '../entities/production-order.entity';

export class FilterProductionOrdersDto {
  /**
   * Filtrar por ID de producto
   */
  @IsOptional()
  @IsUUID()
  productId?: string;

  /**
   * Filtrar por ID de ruta
   */
  @IsOptional()
  @IsUUID()
  routeId?: string;

  /**
   * Filtrar por centro de trabajo principal
   */
  @IsOptional()
  @IsUUID()
  mainWorkCenterId?: string;

  /**
   * Filtrar por estado de la orden (PLANNED, IN_PROGRESS, etc.)
   */
  @IsOptional()
  @IsEnum(ProductionOrderStatus)
  status?: ProductionOrderStatus;

  /**
   * Filtrar por prioridad
   */
  @IsOptional()
  @IsEnum(ProductionOrderPriority)
  priority?: ProductionOrderPriority;

  /**
   * Búsqueda de texto por código o código externo
   */
  @IsOptional()
  @IsString()
  search?: string; // por código / externalCode

  /**
   * Número de página para paginación (default: 1)
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  /**
   * Límite de resultados por página (default: 20)
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}
