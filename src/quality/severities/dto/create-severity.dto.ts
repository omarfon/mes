import { IsNotEmpty, IsString, IsOptional, IsNumber, IsBoolean, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSeverityDto {
  @ApiProperty({ description: 'Código único de severidad' })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({ description: 'Nombre de la severidad' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Descripción' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Nivel de severidad (1-5)', minimum: 1, maximum: 5 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  level: number;

  @ApiPropertyOptional({ description: 'Color hexadecimal', default: '#FFA500' })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional({ description: 'Estado activo', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
