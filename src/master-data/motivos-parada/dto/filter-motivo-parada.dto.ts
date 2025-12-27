import { IsOptional, IsString, IsBoolean, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CategoriaParada, TipoParada } from '../entities/motivo-parada.entity';

export class FilterMotivoParadaDto {
  @ApiPropertyOptional({ description: 'Búsqueda por código o nombre' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ 
    description: 'Filtrar por categoría',
    enum: CategoriaParada 
  })
  @IsOptional()
  @IsEnum(CategoriaParada)
  categoria?: CategoriaParada;

  @ApiPropertyOptional({ 
    description: 'Filtrar por tipo de parada',
    enum: TipoParada 
  })
  @IsOptional()
  @IsEnum(TipoParada)
  tipo?: TipoParada;

  @ApiPropertyOptional({ description: 'Filtrar por estado activo', example: true })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  activo?: boolean;

  @ApiPropertyOptional({ description: 'Filtrar por impacto en OEE', example: true })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  impactaOEE?: boolean;

  @ApiPropertyOptional({ description: 'Filtrar por departamento responsable' })
  @IsOptional()
  @IsString()
  departamentoResponsable?: string;

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
