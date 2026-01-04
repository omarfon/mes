// src/traceability/genealogy/dto/create-lot-genealogy.dto.ts
import { IsNotEmpty, IsUUID, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { RelationType } from '../entities/lot-genealogy.entity';

export class CreateLotGenealogyDto {
  @ApiProperty({ description: 'ID del lote padre (UUID)' })
  @IsNotEmpty()
  @IsUUID()
  parentLotId: string;

  @ApiProperty({ description: 'ID del lote hijo (UUID)' })
  @IsNotEmpty()
  @IsUUID()
  childLotId: string;

  @ApiProperty({ 
    description: 'Tipo de relación',
    enum: RelationType,
    example: RelationType.PARENT 
  })
  @IsNotEmpty()
  @IsEnum(RelationType)
  relationType: RelationType;

  @ApiProperty({ description: 'Cantidad relacionada', example: 100 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiPropertyOptional({ description: 'Unidad de medida', example: 'KG' })
  @IsOptional()
  @IsString()
  unitOfMeasure?: string;

  @ApiPropertyOptional({ description: 'Notas adicionales' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'ID de la orden de trabajo (UUID)' })
  @IsOptional()
  @IsUUID()
  workOrderId?: string;
}