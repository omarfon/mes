import { IsNotEmpty, IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InspectionType, InspectionStatus } from '../../entities/inspection.entity';

export class CreateInspectionDto {
  @ApiProperty({ enum: InspectionType })
  @IsNotEmpty()
  @IsEnum(InspectionType)
  type: InspectionType;

  @ApiProperty({ description: 'ID del nodo de trazabilidad' })
  @IsNotEmpty()
  @IsString()
  nodeId: string;

  @ApiPropertyOptional({ enum: InspectionStatus, default: InspectionStatus.PENDING })
  @IsOptional()
  @IsEnum(InspectionStatus)
  status?: InspectionStatus;

  @ApiPropertyOptional({ description: 'Cantidad inspeccionada' })
  @IsOptional()
  @IsNumber()
  inspectedQuantity?: number;

  @ApiPropertyOptional({ description: 'Notas' })
  @IsOptional()
  @IsString()
  notes?: string;
}
