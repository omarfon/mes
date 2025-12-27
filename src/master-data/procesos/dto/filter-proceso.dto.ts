import { IsOptional, IsString, IsEnum, IsUUID, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TipoProceso, EstadoProceso } from '../entities/proceso.entity';

export class FilterProcesoDto {
  @ApiPropertyOptional({ description: 'Búsqueda por código o nombre' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ 
    description: 'Filtrar por tipo de proceso',
    enum: TipoProceso 
  })
  @IsOptional()
  @IsEnum(TipoProceso)
  tipo?: TipoProceso;

  @ApiPropertyOptional({ 
    description: 'Filtrar por estado',
    enum: EstadoProceso 
  })
  @IsOptional()
  @IsEnum(EstadoProceso)
  estado?: EstadoProceso;

  @ApiPropertyOptional({ description: 'Filtrar por centro de trabajo' })
  @IsOptional()
  @IsUUID()
  workCenterId?: string;

  @ApiPropertyOptional({ description: 'Filtrar por producto' })
  @IsOptional()
  @IsUUID()
  productoId?: string;

  @ApiPropertyOptional({ description: 'Filtrar por ruta de producción' })
  @IsOptional()
  @IsUUID()
  rutaId?: string;

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
