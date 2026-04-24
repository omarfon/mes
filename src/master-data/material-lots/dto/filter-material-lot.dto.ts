import { IsOptional, IsString, IsInt, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { LotStatus } from '../entities/material-lot.entity';

export class FilterMaterialLotDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  materialCode?: string;

  @IsOptional()
  @IsString()
  locationCode?: string;

  @IsOptional()
  @IsEnum(LotStatus)
  status?: LotStatus;

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
