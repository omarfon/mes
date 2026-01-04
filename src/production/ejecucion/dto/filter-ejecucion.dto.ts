import { IsOptional, IsString, IsEnum, IsNumber, IsDateString, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { EstadoEjecucion } from '../entities/ejecucion.entity';

export class FilterEjecucionDto {
  @ApiPropertyOptional({ description: 'Número de página', example: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({ description: 'Registros por página', example: 20, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional({ 
    description: 'Filtrar por estado',
    enum: EstadoEjecucion,
    example: EstadoEjecucion.EN_PROCESO
  })
  @IsOptional()
  @IsEnum(EstadoEjecucion)
  estado?: EstadoEjecucion;

  @ApiPropertyOptional({ description: 'Filtrar por orden de producción' })
  @IsOptional()
  @IsUUID()
  ordenId?: string;

  @ApiPropertyOptional({ description: 'Filtrar por máquina' })
  @IsOptional()
  @IsUUID()
  maquinaId?: string;

  @ApiPropertyOptional({ description: 'Filtrar por operador' })
  @IsOptional()
  @IsUUID()
  operadorId?: string;

  @ApiPropertyOptional({ description: 'Filtrar desde fecha' })
  @IsOptional()
  @IsDateString()
  fechaDesde?: string;

  @ApiPropertyOptional({ description: 'Filtrar hasta fecha' })
  @IsOptional()
  @IsDateString()
  fechaHasta?: string;
}