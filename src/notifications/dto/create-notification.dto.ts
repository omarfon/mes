import { IsString, IsEnum, IsOptional, IsUUID, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationType, NotificationCategory } from '../entities/notification.entity';

export class CreateNotificationDto {
  @ApiProperty({ description: 'ID del usuario destinatario (null = notificación global)', required: false })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({ description: 'Título de la notificación' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Mensaje de la notificación' })
  @IsString()
  message: string;

  @ApiProperty({ enum: NotificationType, default: NotificationType.INFO })
  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

  @ApiProperty({ enum: NotificationCategory, default: NotificationCategory.SYSTEM })
  @IsOptional()
  @IsEnum(NotificationCategory)
  category?: NotificationCategory;

  @ApiProperty({ description: 'Tipo de entidad relacionada', required: false })
  @IsOptional()
  @IsString()
  relatedEntityType?: string;

  @ApiProperty({ description: 'ID de la entidad relacionada', required: false })
  @IsOptional()
  @IsUUID()
  relatedEntityId?: string;

  @ApiProperty({ description: 'Metadatos adicionales', required: false })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
