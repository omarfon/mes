// src/production/control-visual/dto/filter-control-visual.dto.ts
import { IsOptional, IsEnum, IsUUID, IsBoolean, IsNumber, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { EstadoVisual, TipoAlerta } from '../entities/control-visual.entity';

export class FilterControlVisualDto {
  @ApiPropertyOptional({ description: 'Número de página', example: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ description: 'Registros por página', example: 20, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({ description: 'Filtrar por estado', enum: EstadoVisual })
  @IsOptional()
  @IsEnum(EstadoVisual)
  estado?: EstadoVisual;

  @ApiPropertyOptional({ description: 'Filtrar por tipo de alerta', enum: TipoAlerta })
  @IsOptional()
  @IsEnum(TipoAlerta)
  tipoAlerta?: TipoAlerta;

  @ApiPropertyOptional({ description: 'Filtrar por máquina' })
  @IsOptional()
  @IsUUID()
  maquinaId?: string;

  @ApiPropertyOptional({ description: 'Filtrar por centro de trabajo' })
  @IsOptional()
  @IsUUID()
  workCenterId?: string;

  @ApiPropertyOptional({ description: 'Solo alertas activas' })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  alertaActiva?: boolean;

  @ApiPropertyOptional({ description: 'Solo que requieren atención' })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  requiereAtencion?: boolean;

  @ApiPropertyOptional({ description: 'Solo activos' })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;
}