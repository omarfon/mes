import { IsOptional, IsString, IsBoolean, IsInt, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { AreaType } from '../entities/area.entity';

export class FilterAreaDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  plantCode?: string;

  @IsOptional()
  @IsEnum(AreaType)
  type?: AreaType;

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
