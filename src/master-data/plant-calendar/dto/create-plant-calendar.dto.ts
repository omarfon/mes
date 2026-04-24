import { IsString, IsDate, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { CalendarEventType } from '../entities/plant-calendar.entity';

export class CreatePlantCalendarDto {
  @Type(() => Date)
  @IsDate()
  date!: Date;

  @IsEnum(CalendarEventType)
  type!: CalendarEventType;

  @IsString()
  name!: string;

  @IsString()
  plantCode!: string;

  @IsOptional()
  @IsBoolean()
  affectsAll?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}
