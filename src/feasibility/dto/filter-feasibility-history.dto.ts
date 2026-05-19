import { IsOptional, IsString, IsIn, IsInt, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class FilterFeasibilityHistoryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(['PRODUCTION_ORDER', 'PURCHASE_REQUEST'])
  resultType?: string;

  @IsOptional()
  @IsIn(['IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
  status?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
