import { IsString, IsEnum, IsOptional, IsUUID, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ActivityAction, ActivityModule } from '../entities/activity-log.entity';

export class CreateActivityLogDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  userEmail?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  userName?: string;

  @ApiProperty({ enum: ActivityModule })
  @IsEnum(ActivityModule)
  module: ActivityModule;

  @ApiProperty({ enum: ActivityAction })
  @IsEnum(ActivityAction)
  action: ActivityAction;

  @ApiProperty()
  @IsString()
  entityType: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  entityId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  entityName?: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  userAgent?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  oldValues?: Record<string, any>;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  newValues?: Record<string, any>;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
