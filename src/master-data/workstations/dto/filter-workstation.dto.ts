import { IsOptional, IsString, IsBoolean, IsInt, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { WorkstationType } from '../entities/workstation.entity';

export class FilterWorkstationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  workCenterCode?: string;

  @IsOptional()
  @IsEnum(WorkstationType)
  type?: WorkstationType;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  active?: boolean;

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
