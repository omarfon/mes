import { IsOptional, IsString, IsEnum, IsUUID, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoOperador, NivelHabilidad } from '../entities/operador.entity';

export class FilterOperadorDto {
  @ApiPropertyOptional({ description: 'Búsqueda por código, nombre o apellidos' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ 
    description: 'Filtrar por estado',
    enum: EstadoOperador 
  })
  @IsOptional()
  @IsEnum(EstadoOperador)
  estado?: EstadoOperador;

  @ApiPropertyOptional({ 
    description: 'Filtrar por nivel de habilidad',
    enum: NivelHabilidad 
  })
  @IsOptional()
  @IsEnum(NivelHabilidad)
  nivelHabilidad?: NivelHabilidad;

  @ApiPropertyOptional({ description: 'Filtrar por departamento' })
  @IsOptional()
  @IsString()
  departamento?: string;

  @ApiPropertyOptional({ description: 'Filtrar por turno' })
  @IsOptional()
  @IsUUID()
  turnoId?: string;

  @ApiPropertyOptional({ description: 'Filtrar por centro de trabajo' })
  @IsOptional()
  @IsUUID()
  workCenterId?: string;

  @ApiPropertyOptional({ description: 'Filtrar por supervisor' })
  @IsOptional()
  @IsUUID()
  supervisorId?: string;

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
