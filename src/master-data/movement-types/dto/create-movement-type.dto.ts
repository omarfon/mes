import { IsString, MinLength, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { MovementCategory, MovementDirection } from '../entities/movement-type.entity';

export class CreateMovementTypeDto {
  @IsString()
  @MinLength(1)
  code!: string;

  @IsString()
  @MinLength(2)
  name!: string;

  @IsEnum(MovementCategory)
  category!: MovementCategory;

  @IsEnum(MovementDirection)
  direction!: MovementDirection;

  @IsOptional()
  @IsBoolean()
  affectsStock?: boolean;

  @IsOptional()
  @IsBoolean()
  requiresLot?: boolean;

  @IsOptional()
  @IsBoolean()
  requiresReason?: boolean;

  @IsOptional()
  @IsBoolean()
  autoConsumed?: boolean;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}
