import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TraceNodeType } from '../entities/trace-node.entity';

export class FilterTraceNodesDto {
  @ApiPropertyOptional({
    description: 'Texto de búsqueda por código',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: TraceNodeType })
  @IsOptional()
  @IsEnum(TraceNodeType)
  type?: TraceNodeType;

  @ApiPropertyOptional({ description: 'Filtrar por producto' })
  @IsOptional()
  @IsUUID()
  productId?: string;

  @ApiPropertyOptional({
    description: 'Página (paginación)',
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Límite por página',
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}
