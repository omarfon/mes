import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID, IsNumber } from 'class-validator';
import { InspectionType } from '../entities/inspection.entity';

export class CreateInspectionDto {
  @ApiProperty({ enum: InspectionType })
  @IsEnum(InspectionType)
  type: InspectionType;

  @ApiProperty({ description: 'ID del nodo trazable (lote, prenda, pieza, etc.)' })
  @IsUUID()
  nodeId: string;

  @ApiProperty({ example: 50 })
  @IsOptional()
  @IsNumber()
  inspectedQuantity?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  notes?: string;
}
