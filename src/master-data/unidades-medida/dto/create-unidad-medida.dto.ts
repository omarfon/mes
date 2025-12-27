import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsEnum, IsNumber, IsUUID, MaxLength, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TipoUnidadMedida } from '../entities/unidad-medida.entity';

export class CreateUnidadMedidaDto {
  @ApiProperty({ description: 'Código único de la unidad', example: 'KG' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  codigo: string;

  @ApiProperty({ description: 'Nombre de la unidad', example: 'Kilogramo' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @ApiProperty({ description: 'Símbolo de la unidad', example: 'kg' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  simbolo: string;

  @ApiProperty({ 
    description: 'Tipo de unidad de medida',
    enum: TipoUnidadMedida,
    example: TipoUnidadMedida.MASA 
  })
  @IsEnum(TipoUnidadMedida)
  @IsNotEmpty()
  tipo: TipoUnidadMedida;

  @ApiPropertyOptional({ description: 'Descripción de la unidad' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({ description: 'Factor de conversión a unidad base', example: 1000 })
  @IsOptional()
  @IsNumber()
  factorConversion?: number;

  @ApiPropertyOptional({ description: 'ID de la unidad base para conversión' })
  @IsOptional()
  @IsUUID()
  unidadBaseId?: string;

  @ApiPropertyOptional({ description: 'Es unidad del Sistema Internacional', example: true })
  @IsOptional()
  @IsBoolean()
  esSI?: boolean;

  @ApiPropertyOptional({ description: 'Estado activo', example: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @ApiPropertyOptional({ description: 'Decimales por defecto', example: 2 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  decimales?: number;
}
