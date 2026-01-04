// src/production/control-visual/dto/create-control-visual.dto.ts
import { IsUUID, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsBoolean, IsString, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoVisual, TipoAlerta } from '../entities/control-visual.entity';

export class CreateControlVisualDto {
  @ApiPropertyOptional({ description: 'ID de la máquina' })
  @IsOptional()
  @IsUUID()
  maquinaId?: string;

  @ApiPropertyOptional({ description: 'ID del centro de trabajo' })
  @IsOptional()
  @IsUUID()
  workCenterId?: string;

  @ApiPropertyOptional({ description: 'ID de la orden de producción' })
  @IsOptional()
  @IsUUID()
  ordenId?: string;

  @ApiPropertyOptional({ 
    description: 'Estado visual',
    enum: EstadoVisual,
    default: EstadoVisual.NORMAL
  })
  @IsOptional()
  @IsEnum(EstadoVisual)
  estado?: EstadoVisual;

  @ApiPropertyOptional({ description: 'Tipo de alerta', enum: TipoAlerta })
  @IsOptional()
  @IsEnum(TipoAlerta)
  tipoAlerta?: TipoAlerta;

  @ApiPropertyOptional({ description: 'Mensaje de alerta' })
  @IsOptional()
  @IsString()
  mensaje?: string;

  @ApiPropertyOptional({ description: 'Descripción detallada' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({ description: 'Eficiencia actual (%)', example: 85.5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  eficienciaActual?: number;

  @ApiPropertyOptional({ description: 'Producción actual' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  produccionActual?: number;

  @ApiPropertyOptional({ description: 'Producción objetivo' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  produccionObjetivo?: number;

  @ApiPropertyOptional({ description: 'Piezas rechazadas', default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  piezasRechazadas?: number;

  @ApiPropertyOptional({ description: 'Tiempo de parada en minutos', default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  tiempoParadaMinutos?: number;

  @ApiPropertyOptional({ description: 'Requiere atención inmediata' })
  @IsOptional()
  @IsBoolean()
  requiereAtencion?: boolean;

  @ApiPropertyOptional({ description: 'Alerta activa' })
  @IsOptional()
  @IsBoolean()
  alertaActiva?: boolean;

  @ApiPropertyOptional({ description: 'Métricas adicionales (JSON)' })
  @IsOptional()
  metricas?: any;
}