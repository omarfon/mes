import { IsString, MinLength, IsOptional, IsBoolean, IsInt, Min, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRecipeParamDto {
  @IsString()
  paramName!: string;

  @IsString()
  setpoint!: string;

  @IsOptional()
  @IsString()
  minValue?: string;

  @IsOptional()
  @IsString()
  maxValue?: string;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsBoolean()
  critical?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateRecipeDto {
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
  operationCode?: string;

  @IsOptional()
  @IsString()
  version?: string;

  @IsOptional()
  @IsString()
  approvedBy?: string;

  @IsOptional()
  @IsString()
  approvedAt?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRecipeParamDto)
  params?: CreateRecipeParamDto[];
}
