import { IsOptional, IsString, IsBoolean, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TipoUnidadMedida } from '../entities/unidad-medida.entity';

export class FilterUnidadMedidaDto {
  @ApiPropertyOptional({ description: 'Búsqueda por código, nombre o símbolo' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ 
    description: 'Filtrar por tipo de unidad',
    enum: TipoUnidadMedida 
  })
  @IsOptional()
  @IsEnum(TipoUnidadMedida)
  tipo?: TipoUnidadMedida;

  @ApiPropertyOptional({ description: 'Filtrar por estado activo', example: true })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  activo?: boolean;

  @ApiPropertyOptional({ description: 'Filtrar por unidades SI', example: true })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  esSI?: boolean;

  @ApiPropertyOptional({ description: 'Número de página', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ description: 'Cantidad de registros por página', example: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}
