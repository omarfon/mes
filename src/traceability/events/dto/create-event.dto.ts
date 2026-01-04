import { IsNotEmpty, IsString, IsEnum, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EventType } from '../entities/traceability-event.entity';

export class CreateEventDto {
  @ApiProperty({ enum: EventType })
  @IsNotEmpty()
  @IsEnum(EventType)
  eventType: EventType;

  @ApiProperty({ description: 'Tipo de entidad (lot, serial, movement, etc.)' })
  @IsNotEmpty()
  @IsString()
  entityType: string;

  @ApiProperty({ description: 'ID de la entidad' })
  @IsNotEmpty()
  @IsString()
  entityId: string;

  @ApiPropertyOptional({ description: 'Descripción del evento' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Valor anterior' })
  @IsOptional()
  @IsObject()
  oldValue?: any;

  @ApiPropertyOptional({ description: 'Valor nuevo' })
  @IsOptional()
  @IsObject()
  newValue?: any;

  @ApiPropertyOptional({ description: 'Dirección IP' })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiPropertyOptional({ description: 'User Agent' })
  @IsOptional()
  @IsString()
  userAgent?: string;
}
