import { IsString, MinLength, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { LocationType } from '../entities/location.entity';

export class CreateLocationDto {
  @IsString()
  @MinLength(1)
  code!: string;

  @IsString()
  @MinLength(2)
  name!: string;

  @IsOptional()
  @IsEnum(LocationType)
  type?: LocationType;

  @IsOptional()
  @IsString()
  parentCode?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
