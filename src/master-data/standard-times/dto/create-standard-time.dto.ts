import { IsString, IsNumber, IsOptional, IsBoolean, IsInt, Min } from 'class-validator';

export class CreateStandardTimeDto {
  @IsString()
  operationCode!: string;

  @IsString()
  operationName!: string;

  @IsString()
  productCode!: string;

  @IsString()
  workCenterCode!: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  setupMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cycleMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  timePerUnitMin?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  batchSize?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  efficiencyPct?: number;

  @IsOptional()
  @IsString()
  validFrom?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}
