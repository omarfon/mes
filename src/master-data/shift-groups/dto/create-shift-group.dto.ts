import { IsString, MinLength, IsOptional, IsBoolean, IsInt, Min, IsArray } from 'class-validator';

export class CreateShiftGroupDto {
  @IsString()
  @MinLength(1)
  code!: string;

  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  plantCode!: string;

  @IsOptional()
  @IsString()
  shiftCodes?: string;

  @IsOptional()
  @IsString()
  supervisorCode?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  headcount?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
