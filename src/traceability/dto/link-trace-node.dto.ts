import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TraceLinkType } from '../entities/trace-link.entity';

export class LinkTraceNodesDto {
  @ApiProperty({ description: 'ID del nodo padre' })
  @IsUUID()
  parentNodeId: string;

  @ApiProperty({ description: 'ID del nodo hijo' })
  @IsUUID()
  childNodeId: string;

  @ApiPropertyOptional({
    enum: TraceLinkType,
    example: TraceLinkType.TRANSFORMATION,
    description: 'Tipo de relación',
  })
  @IsOptional()
  @IsEnum(TraceLinkType)
  type?: TraceLinkType;

  @ApiPropertyOptional({
    example: 100,
    description: 'Cantidad del nodo padre usada en el hijo',
  })
  @IsOptional()
  @IsNumber()
  @Min(0.0001)
  quantityUsed?: number;

  @ApiPropertyOptional({
    description: 'ID de referencia al proceso (opcional)',
  })
  @IsOptional()
  @IsString()
  processRefId?: string;

  @ApiPropertyOptional({
    example: 'PO_OPERATION',
    description: 'Tipo de referencia al proceso (opcional)',
  })
  @IsOptional()
  @IsString()
  processRefType?: string;
}
