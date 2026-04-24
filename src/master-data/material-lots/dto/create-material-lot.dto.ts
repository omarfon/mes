import { IsString, MinLength, IsOptional, IsDate, IsNumber, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { LotStatus } from '../entities/material-lot.entity';

export class CreateMaterialLotDto {
  @IsString()
  @MinLength(1)
  lotNumber!: string;

  @IsString()
  materialCode!: string;

  @IsString()
  materialName!: string;

  @IsOptional()
  @IsString()
  supplierCode?: string;

  @IsOptional()
  @IsString()
  supplierLot?: string;

  @Type(() => Date)
  @IsDate()
  receivedDate!: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expiryDate?: Date;

  @IsNumber()
  @Min(0)
  initialQty!: number;

  @IsNumber()
  @Min(0)
  availableQty!: number;

  @IsString()
  uom!: string;

  @IsOptional()
  @IsString()
  locationCode?: string;

  @IsOptional()
  @IsEnum(LotStatus)
  status?: LotStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
