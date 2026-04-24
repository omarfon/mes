import { IsString, MinLength, IsOptional, IsBoolean, IsInt, Min, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRoutingStepDto {
  @IsInt()
  @Min(1)
  seq!: number;

  @IsString()
  operationCode!: string;

  @IsString()
  operationName!: string;

  @IsString()
  workCenterCode!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  setupMin?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  cycleMin?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  qtyPerCycle?: number;

  @IsOptional()
  @IsBoolean()
  mandatory?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateRoutingDto {
  @IsString()
  @MinLength(1)
  code!: string;

  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  productCode!: string;

  @IsOptional()
  @IsString()
  version?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRoutingStepDto)
  steps?: CreateRoutingStepDto[];
}
