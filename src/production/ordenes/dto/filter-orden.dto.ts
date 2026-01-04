import { IsOptional, IsString, IsEnum, IsNumber, IsDateString, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { EstadoOrden, PrioridadOrden } from '../entities/orden.entity';

export class FilterOrdenDto {
  @ApiPropertyOptional({ description: 'Número de página', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({ description: 'Registros por página', example: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional({ description: 'Búsqueda por número de orden, producto, cliente' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filtrar por estado', enum: EstadoOrden })
  @IsOptional()
  @IsEnum(EstadoOrden)
  estado?: EstadoOrden;

  @ApiPropertyOptional({ description: 'Filtrar por prioridad', enum: PrioridadOrden })
  @IsOptional()
  @IsEnum(PrioridadOrden)
  prioridad?: PrioridadOrden;

  @ApiPropertyOptional({ description: 'Filtrar por ID de producto' })
  @IsOptional()
  @IsUUID()
  productoId?: string;

  @ApiPropertyOptional({ description: 'Filtrar por centro de trabajo' })
  @IsOptional()
  @IsUUID()
  workCenterId?: string;

  @ApiPropertyOptional({ description: 'Filtrar por turno' })
  @IsOptional()
  @IsUUID()
  turnoId?: string;

  @ApiPropertyOptional({ description: 'Fecha inicio desde (ISO)' })
  @IsOptional()
  @IsDateString()
  fechaDesde?: string;

  @ApiPropertyOptional({ description: 'Fecha inicio hasta (ISO)' })
  @IsOptional()
  @IsDateString()
  fechaHasta?: string;
}
