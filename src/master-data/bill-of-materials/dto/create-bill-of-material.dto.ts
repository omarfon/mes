import { IsString, MinLength, IsOptional, IsBoolean, IsInt, Min, IsNumber, IsDate, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBomLineDto {
  @IsString()
  materialCode!: string;

  @IsString()
  materialName!: string;

  @IsNumber()
  @Min(0)
  qty!: number;

  @IsString()
  uom!: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  scrapPct?: number;

  @IsOptional()
  @IsString()
  phase?: string;

  @IsOptional()
  @IsBoolean()
  optional?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateBillOfMaterialDto {
  @IsString()
  @MinLength(1)
  code!: string;

  @IsString()
  productCode!: string;

  @IsString()
  productName!: string;

  @IsOptional()
  @IsString()
  version?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  baseQty?: number;

  @IsString()
  baseUom!: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  validFrom?: Date;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBomLineDto)
  lines?: CreateBomLineDto[];
}
