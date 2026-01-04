import { IsNotEmpty, IsString, IsEnum, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LocationType } from '../entities/location.entity';

export class CreateLocationDto {
  @ApiProperty({ description: 'Código único de ubicación' })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({ description: 'Nombre de la ubicación' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ enum: LocationType })
  @IsNotEmpty()
  @IsEnum(LocationType)
  type: LocationType;

  @ApiPropertyOptional({ description: 'ID de ubicación padre' })
  @IsOptional()
  @IsString()
  parentLocationId?: string;

  @ApiPropertyOptional({ description: 'Coordenada X' })
  @IsOptional()
  @IsNumber()
  xCoordinate?: number;

  @ApiPropertyOptional({ description: 'Coordenada Y' })
  @IsOptional()
  @IsNumber()
  yCoordinate?: number;

  @ApiPropertyOptional({ description: 'Coordenada Z' })
  @IsOptional()
  @IsNumber()
  zCoordinate?: number;

  @ApiPropertyOptional({ description: 'Capacidad máxima' })
  @IsOptional()
  @IsNumber()
  maxCapacity?: number;

  @ApiPropertyOptional({ description: 'Unidad de medida' })
  @IsOptional()
  @IsString()
  unitOfMeasure?: string;

  @ApiPropertyOptional({ description: 'Estado activo' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Descripción' })
  @IsOptional()
  @IsString()
  description?: string;
}
