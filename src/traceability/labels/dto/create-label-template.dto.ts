import { IsNotEmpty, IsString, IsEnum, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LabelFormat } from '../entities/label-template.entity';

export class CreateLabelTemplateDto {
  @ApiProperty({ description: 'Código único de la plantilla' })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({ description: 'Nombre de la plantilla' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ enum: LabelFormat })
  @IsNotEmpty()
  @IsEnum(LabelFormat)
  format: LabelFormat;

  @ApiProperty({ description: 'Contenido de la plantilla (ZPL, EPL, HTML, etc.)' })
  @IsNotEmpty()
  @IsString()
  template: string;

  @ApiPropertyOptional({ description: 'Descripción de la plantilla' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Ancho en mm' })
  @IsOptional()
  @IsNumber()
  widthMm?: number;

  @ApiPropertyOptional({ description: 'Alto en mm' })
  @IsOptional()
  @IsNumber()
  heightMm?: number;

  @ApiPropertyOptional({ description: 'Estado activo' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
