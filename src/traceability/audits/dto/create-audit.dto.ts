import { IsNotEmpty, IsString, IsEnum, IsOptional, IsObject, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AuditAction } from '../entities/audit.entity';

export class CreateAuditDto {
  @ApiProperty({ enum: AuditAction, description: 'Acción realizada' })
  @IsNotEmpty()
  @IsEnum(AuditAction)
  action: AuditAction;

  @ApiProperty({ description: 'Tipo de entidad auditada' })
  @IsNotEmpty()
  @IsString()
  entityType: string;

  @ApiProperty({ description: 'ID de la entidad auditada' })
  @IsNotEmpty()
  @IsString()
  entityId: string;

  @ApiPropertyOptional({ description: 'ID del usuario que realizó la acción' })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({ description: 'Valores anteriores' })
  @IsOptional()
  @IsObject()
  oldValues?: any;

  @ApiPropertyOptional({ description: 'Valores nuevos' })
  @IsOptional()
  @IsObject()
  newValues?: any;

  @ApiPropertyOptional({ description: 'Descripción de la acción' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Dirección IP' })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiPropertyOptional({ description: 'User Agent del navegador' })
  @IsOptional()
  @IsString()
  userAgent?: string;

  @ApiPropertyOptional({ description: 'Módulo del sistema' })
  @IsOptional()
  @IsString()
  module?: string;

  @ApiPropertyOptional({ description: 'Metadatos adicionales' })
  @IsOptional()
  @IsObject()
  metadata?: any;
}
