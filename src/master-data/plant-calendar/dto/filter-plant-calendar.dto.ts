import { IsOptional, IsString, IsInt, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { CalendarEventType } from '../entities/plant-calendar.entity';

export class FilterPlantCalendarDto {
  @IsOptional()
  @IsString()
  plantCode?: string;

  @IsOptional()
  @IsEnum(CalendarEventType)
  type?: CalendarEventType;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}
