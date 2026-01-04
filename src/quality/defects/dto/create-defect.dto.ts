import { IsNotEmpty, IsString, IsOptional, IsNumber, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DefectStatus } from '../entities/defect.entity';

export class CreateDefectDto {
  @ApiProperty({ description: 'Código único del defecto' })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({ description: 'Nombre del defecto' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Descripción' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'ID de la familia de defecto' })
  @IsNotEmpty()
  @IsString()
  familyId: string;

  @ApiProperty({ description: 'ID de la severidad' })
  @IsNotEmpty()
  @IsString()
  severityId: string;

  @ApiPropertyOptional({ enum: DefectStatus, default: DefectStatus.OPEN })
  @IsOptional()
  @IsEnum(DefectStatus)
  status?: DefectStatus;

  @ApiPropertyOptional({ description: 'ID del producto' })
  @IsOptional()
  @IsString()
  productId?: string;

  @ApiPropertyOptional({ description: 'ID de la orden de producción' })
  @IsOptional()
  @IsString()
  productionOrderId?: string;

  @ApiPropertyOptional({ description: 'ID de la inspección' })
  @IsOptional()
  @IsString()
  inspectionId?: string;

  @ApiPropertyOptional({ description: 'Cantidad', default: 1 })
  @IsOptional()
  @IsNumber()
  quantity?: number;

  @ApiPropertyOptional({ description: 'Detectado por (user ID)' })
  @IsOptional()
  @IsString()
  detectedBy?: string;

  @ApiPropertyOptional({ description: 'Fecha de detección' })
  @IsOptional()
  @IsDateString()
  detectedAt?: Date;

  @ApiPropertyOptional({ description: 'Notas' })
  @IsOptional()
  @IsString()
  notes?: string;
}
