import { IsString, MinLength, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { AreaType } from '../entities/area.entity';

export class CreateAreaDto {
  @IsString()
  @MinLength(1)
  code!: string;

  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  plantCode!: string;

  @IsOptional()
  @IsEnum(AreaType)
  type?: AreaType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
