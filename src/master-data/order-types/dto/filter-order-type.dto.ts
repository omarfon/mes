import { IsOptional, IsString, IsBoolean, IsInt, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderPriority } from '../entities/order-type.entity';

export class FilterOrderTypeDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(OrderPriority)
  priority?: OrderPriority;

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
