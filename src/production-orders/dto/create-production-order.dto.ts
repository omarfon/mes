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
  /**
   * Código único de la Orden de Producción (ej. OP-2023-001)
   */
  @IsString()
  code: string; // podrías generar esto en backend si prefieres

  /**
   * Código externo opcional (referencia a ERP o sistema legado)
   */
  @IsOptional()
  @IsString()
  externalCode?: string;

  /**
   * ID del producto a fabricar
   */
  @IsUUID()
  productId: string;

  /**
   * ID de la ruta de producción a utilizar
   */
  @IsUUID()
  routeId: string;

  /**
   * Cantidad planificada a producir
   */
  @IsNumber()
  @Min(0.0001)
  quantityPlanned: number;

  /**
   * Prioridad de la orden (LOW, NORMAL, HIGH, URGENT)
   */
  @IsOptional()
  @IsEnum(ProductionOrderPriority)
  priority?: ProductionOrderPriority;

  /**
   * ID del centro de trabajo principal (opcional)
   */
  @IsOptional()
  @IsUUID()
  mainWorkCenterId?: string;

  /**
   * ID del turno asignado (opcional)
   */
  @IsOptional()
  @IsUUID()
  shiftId?: string;

  /**
   * Fecha planificada de inicio (ISO 8601)
   */
  @IsOptional()
  @IsDateString()
  plannedStartDate?: string;

  /**
   * Fecha planificada de fin (ISO 8601)
   */
  @IsOptional()
  @IsDateString()
  plannedEndDate?: string;

  /**
   * Fecha límite de entrega (ISO 8601)
   */
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  /**
   * Notas o comentarios adicionales
   */
  @IsOptional()
  @IsString()
  notes?: string;
}
