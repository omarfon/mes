import { IsString, MinLength, IsOptional, IsBoolean, IsDecimal, IsNumber } from 'class-validator';

export class CreateProductVariantDto {
  @IsString()
  @MinLength(1)
  sku!: string;

  @IsString()
  productCode!: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsString()
  presentation?: string;

  @IsOptional()
  @IsString()
  barcode?: string;

  @IsOptional()
  @IsNumber()
  netWeight?: number;

  @IsOptional()
  @IsString()
  weightUnit?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
