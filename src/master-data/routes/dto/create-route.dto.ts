import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
  ArrayMinSize,
  ArrayNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRouteOperationDto {
  @IsInt()
  @Min(1)
  sequence: number;

  @IsString()
  name: string;

  @IsOptional()
  @IsUUID()
  workCenterId?: string;

  @IsOptional()
  @IsUUID()
  machineId?: string;

  @IsOptional()
  standardTimeMinutes?: number;

  @IsOptional()
  @IsBoolean()
  overlapAllowed?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateRouteDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsOptional()
  description?: string;

  @IsUUID()
  productId: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  version?: number;

  @IsOptional()
  @IsDateString()
  effectiveFrom?: string;

  @IsOptional()
  @IsDateString()
  effectiveTo?: string;

  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateRouteOperationDto)
  operations: CreateRouteOperationDto[];
}
