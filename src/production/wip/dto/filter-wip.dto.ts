import { IsOptional, IsString, IsNumber, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FilterWIPDto {
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

  @ApiPropertyOptional({ description: 'Búsqueda por producto, lote o ubicación' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filtrar por orden de producción' })
  @IsOptional()
  @IsUUID()
  ordenId?: string;

  @ApiPropertyOptional({ description: 'Filtrar por producto' })
  @IsOptional()
  @IsUUID()
  productoId?: string;

  @ApiPropertyOptional({ description: 'Filtrar por centro de trabajo' })
  @IsOptional()
  @IsUUID()
  workCenterId?: string;

  @ApiPropertyOptional({ description: 'Filtrar por lote' })
  @IsOptional()
  @IsString()
  lote?: string;
}