import { IsString, MinLength, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { MaterialType } from '../entities/material.entity';

export class CreateMaterialDto {
  @IsString()
  @MinLength(1)
  code!: string;

  @IsString()
  @MinLength(2)
  name!: string;

  @IsOptional()
  @IsEnum(MaterialType)
  type?: MaterialType;

  @IsString()
  uom!: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
