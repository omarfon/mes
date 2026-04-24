import { IsString, MinLength, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { ScrapClassification } from '../entities/scrap-reason.entity';

export class CreateScrapReasonDto {
  @IsString()
  @MinLength(1)
  code!: string;

  @IsString()
  @MinLength(2)
  name!: string;

  @IsOptional()
  @IsEnum(ScrapClassification)
  classification?: ScrapClassification;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  affectsEfficiency?: boolean;

  @IsOptional()
  @IsBoolean()
  reportable?: boolean;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
