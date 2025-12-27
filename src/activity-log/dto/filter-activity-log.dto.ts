import { IsOptional, IsEnum, IsUUID, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ActivityAction, ActivityModule } from '../entities/activity-log.entity';

export class FilterActivityLogDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({ enum: ActivityModule, required: false })
  @IsOptional()
  @IsEnum(ActivityModule)
  module?: ActivityModule;

  @ApiProperty({ enum: ActivityAction, required: false })
  @IsOptional()
  @IsEnum(ActivityAction)
  action?: ActivityAction;

  @ApiProperty({ required: false })
  @IsOptional()
  entityType?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  entityId?: string;

  @ApiProperty({ required: false, description: 'Fecha desde (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ required: false, description: 'Fecha hasta (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
