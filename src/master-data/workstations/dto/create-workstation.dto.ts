import { IsString, MinLength, IsOptional, IsBoolean, IsEnum, IsInt, Min } from 'class-validator';
import { WorkstationType } from '../entities/workstation.entity';

export class CreateWorkstationDto {
  @IsString()
  @MinLength(1)
  code!: string;

  @IsString()
  @MinLength(2)
  name!: string;

  @IsOptional()
  @IsString()
  workCenterCode?: string;

  @IsOptional()
  @IsEnum(WorkstationType)
  type?: WorkstationType;

  @IsOptional()
  @IsString()
  asset?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  operatorSlots?: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
