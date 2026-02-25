import { IsString, IsOptional, IsEnum, IsInt, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ComponentStatus } from '../enums/component-status.enum';
import { ComponentCriticality } from '../enums/component-criticality.enum';

export class CreateComponentDto {
  @ApiProperty({ description: 'Código único del componente', example: 'COMP-M001-MOT' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'Nombre del componente', example: 'Motor Principal' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Código del activo padre', required: false, example: 'M-001' })
  @IsString()
  @IsOptional()
  assetCode?: string;

  @ApiProperty({ description: 'Nombre del activo padre', required: false, example: 'Máquina CNC 1' })
  @IsString()
  @IsOptional()
  assetName?: string;

  @ApiProperty({ description: 'Categoría del componente', required: false, example: 'Motor' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({ enum: ComponentStatus, default: ComponentStatus.OPERATIONAL })
  @IsEnum(ComponentStatus)
  @IsOptional()
  status?: ComponentStatus;

  @ApiProperty({ description: 'Fabricante', required: false, example: 'Siemens' })
  @IsString()
  @IsOptional()
  manufacturer?: string;

  @ApiProperty({ description: 'Modelo', required: false, example: 'IE3-100L' })
  @IsString()
  @IsOptional()
  model?: string;

  @ApiProperty({ description: 'Número de serie', required: false, example: 'SN-2024-001' })
  @IsString()
  @IsOptional()
  serialNumber?: string;

  @ApiProperty({ enum: ComponentCriticality, default: ComponentCriticality.MEDIUM })
  @IsEnum(ComponentCriticality)
  @IsOptional()
  criticality?: ComponentCriticality;

  @ApiProperty({ description: 'Fecha de instalación', required: false, example: '2024-01-15' })
  @IsDateString()
  @IsOptional()
  installDate?: Date;

  @ApiProperty({ description: 'Vida esperada en horas', required: false, example: 10000 })
  @IsInt()
  @IsOptional()
  expectedLifeHours?: number;

  @ApiProperty({ description: 'Horas actuales de operación', required: false, example: 0 })
  @IsInt()
  @IsOptional()
  currentHours?: number;

  @ApiProperty({ description: 'Notas adicionales', required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ description: 'Fecha de última inspección', required: false })
  @IsDateString()
  @IsOptional()
  lastInspection?: Date;

  @ApiProperty({ description: 'Fecha de próxima inspección', required: false })
  @IsDateString()
  @IsOptional()
  nextInspection?: Date;
}
