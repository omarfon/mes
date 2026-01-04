import { IsOptional, IsString, IsEnum, IsNumber, IsDateString, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { EstadoDespacho, TipoDespacho } from '../entities/despacho.entity';

export class FilterDespachoDto {
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

  @ApiPropertyOptional({ description: 'Búsqueda por número, destino, cliente' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filtrar por estado', enum: EstadoDespacho })
  @IsOptional()
  @IsEnum(EstadoDespacho)
  estado?: EstadoDespacho;

  @ApiPropertyOptional({ description: 'Filtrar por tipo', enum: TipoDespacho })
  @IsOptional()
  @IsEnum(TipoDespacho)
  tipo?: TipoDespacho;

  @ApiPropertyOptional({ description: 'Filtrar por orden de producción' })
  @IsOptional()
  @IsUUID()
  ordenId?: string;
}
