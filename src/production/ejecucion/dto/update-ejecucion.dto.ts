import { PartialType } from '@nestjs/swagger';
import { CreateEjecucionDto } from './create-ejecucion.dto';
import { IsOptional, IsDateString, IsArray, ValidateNested } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ParadaDto {
  @ApiPropertyOptional({ description: 'ID del motivo de parada' })
  @IsOptional()
  motivoId?: string;

  @ApiPropertyOptional({ description: 'Descripción del motivo' })
  @IsOptional()
  motivo?: string;

  @ApiPropertyOptional({ description: 'Fecha y hora de inicio de la parada' })
  @IsOptional()
  @IsDateString()
  inicio?: string;

  @ApiPropertyOptional({ description: 'Fecha y hora de fin de la parada' })
  @IsOptional()
  @IsDateString()
  fin?: string;

  @ApiPropertyOptional({ description: 'Duración en minutos' })
  @IsOptional()
  duracion?: number;

  @ApiPropertyOptional({ description: 'Observaciones de la parada' })
  @IsOptional()
  observaciones?: string;
}

export class UpdateEjecucionDto extends PartialType(CreateEjecucionDto) {
  @ApiPropertyOptional({ description: 'Fecha y hora de finalización' })
  @IsOptional()
  @IsDateString()
  fechaFin?: string;

  @ApiPropertyOptional({ 
    description: 'Registro de paradas',
    type: [ParadaDto]
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ParadaDto)
  paradas?: ParadaDto[];
}