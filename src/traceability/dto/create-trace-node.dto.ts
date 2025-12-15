import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TraceNodeType } from '../entities/trace-node.entity';

export class CreateTraceNodeDto {
  @ApiProperty({
    example: 'L-ALG-2025-0001',
    description: 'Código del nodo (lote, prenda, contenedor, etc.)',
  })
  @IsString()
  code: string;

  @ApiProperty({
    enum: TraceNodeType,
    example: TraceNodeType.MATERIAL_LOT,
    description: 'Tipo de nodo trazable',
  })
  @IsEnum(TraceNodeType)
  type: TraceNodeType;

  @ApiPropertyOptional({
    description: 'Producto asociado (para elementos físicos)',
  })
  @IsOptional()
  @IsUUID()
  productId?: string;

  @ApiPropertyOptional({
    description: 'Orden de producción que generó el nodo',
  })
  @IsOptional()
  @IsUUID()
  productionOrderId?: string;

  @ApiPropertyOptional({
    example: 1000,
    description: 'Cantidad asociada (si aplica)',
  })
  @IsOptional()
  @IsNumber()
  @Min(0.0001)
  quantity?: number;

  @ApiPropertyOptional({
    example: 'KG',
    description: 'Unidad de medida (KG, M, UNID, etc.)',
  })
  @IsOptional()
  @IsString()
  unitOfMeasure?: string;

  @ApiPropertyOptional({
    description: 'Metadatos adicionales (talla, color, lote proveedor, etc.)',
  })
  @IsOptional()
  metadata?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Fecha de fabricación' })
  @IsOptional()
  @IsDateString()
  manufacturingDate?: string;

  @ApiPropertyOptional({ description: 'Fecha de expiración' })
  @IsOptional()
  @IsDateString()
  expirationDate?: string;

  @ApiPropertyOptional({ description: 'Notas adicionales' })
  @IsOptional()
  @IsString()
  notes?: string;
}
