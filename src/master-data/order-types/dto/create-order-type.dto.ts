import { IsString, MinLength, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { OrderPriority } from '../entities/order-type.entity';

export class CreateOrderTypeDto {
  @IsString()
  @MinLength(1)
  code!: string;

  @IsString()
  @MinLength(2)
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(OrderPriority)
  priority?: OrderPriority;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsBoolean()
  allowsRework?: boolean;

  @IsOptional()
  @IsBoolean()
  requiresQA?: boolean;

  @IsOptional()
  @IsBoolean()
  requiresRelease?: boolean;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
