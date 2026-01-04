import { IsUUID, IsNotEmpty, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoEjecucion } from '../entities/ejecucion.entity';

export class CreateEjecucionDto {
  @ApiProperty({ description: 'ID de la orden de producción' })
  @IsUUID()
  @IsNotEmpty()
  ordenId: string;

  @ApiProperty({ description: 'ID de la máquina' })
  @IsUUID()
  @IsNotEmpty()
  maquinaId: string;

  @ApiProperty({ description: 'ID del operador' })
  @IsUUID()
  @IsNotEmpty()
  operadorId: string;

  @ApiPropertyOptional({ 
    description: 'Estado de la ejecución',
    enum: EstadoEjecucion,
    example: EstadoEjecucion.INICIADA,
    default: EstadoEjecucion.INICIADA
  })
  @IsOptional()
  @IsEnum(EstadoEjecucion)
  estado?: EstadoEjecucion;

  @ApiPropertyOptional({ 
    description: 'Fecha y hora de inicio (si no se envía, se usa la fecha actual)',
    example: '2024-01-15T08:00:00Z'
  })
  @IsOptional()
  @IsDateString()
  fechaInicio?: string;

  @ApiPropertyOptional({ 
    description: 'Parámetros técnicos de la ejecución (JSON)',
    example: { temperatura: 180, velocidad: 50, presion: 2.5 }
  })
  @IsOptional()
  parametros?: any;

  @ApiPropertyOptional({ description: 'Observaciones' })
  @IsOptional()
  observaciones?: string;
}