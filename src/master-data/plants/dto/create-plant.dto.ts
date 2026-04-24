import { IsString, MinLength, IsOptional, IsBoolean } from 'class-validator';

export class CreatePlantDto {
  @IsString()
  @MinLength(1)
  code!: string;

  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @MinLength(2)
  country!: string;

  @IsString()
  @MinLength(2)
  city!: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
