import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { WorkCenterType } from '../entities/work-center.entity';

export class CreateWorkCenterDto {
  @IsString()
  @MinLength(1)
  code: string;

  @IsString()
  @MinLength(2)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(WorkCenterType)
  type?: WorkCenterType;

  @IsOptional()
  @IsString()
  area?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsNumber()
  nominalCapacity?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
