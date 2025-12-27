import { IsOptional, IsBoolean, IsEnum, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { NotificationType, NotificationCategory } from '../entities/notification.entity';

export class FilterNotificationsDto extends PaginationDto {
  @ApiProperty({ description: 'ID del usuario', required: false })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({ description: 'Filtrar por leídas/no leídas', required: false })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isRead?: boolean;

  @ApiProperty({ enum: NotificationType, required: false })
  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

  @ApiProperty({ enum: NotificationCategory, required: false })
  @IsOptional()
  @IsEnum(NotificationCategory)
  category?: NotificationCategory;
}
