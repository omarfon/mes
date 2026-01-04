import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { LotStatus } from '../entities/lot.entity';

export class CreateLotDto {
  @IsString()
  @IsNotEmpty()
  lotNumber: string;

  @IsString()
  @IsOptional()
  internalCode?: string;

  @IsString()
  @IsOptional()
  externalCode?: string;

  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  productCode: string;

  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsEnum(LotStatus)
  @IsOptional()
  status?: LotStatus;

  @IsNumber()
  @IsNotEmpty()
  quantityInitial: number;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsUUID()
  @IsOptional()
  parentLotId?: string;

  @IsUUID()
  @IsOptional()
  workOrderId?: string;

  @IsUUID()
  @IsOptional()
  locationId?: string;

  @IsUUID()
  @IsOptional()
  supplierId?: string;

  @IsString()
  @IsOptional()
  supplierLot?: string;

  @IsDateString()
  @IsOptional()
  manufactureDate?: string;

  @IsDateString()
  @IsOptional()
  expiryDate?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsOptional()
  attributes?: any;

  @IsOptional()
  metadata?: any;
}
