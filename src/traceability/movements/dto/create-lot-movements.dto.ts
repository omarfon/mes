// src/traceability/movements/dto/create-lot-movement.dto.ts
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { MovementType } from '../entities/lot-movement.entity';

export class CreateLotMovementDto {
  @IsString()
  @IsNotEmpty()
  lotCode: string;

  @IsEnum(MovementType)
  @IsNotEmpty()
  type: MovementType;

  @IsNumber()
  @IsNotEmpty()
  qty: number;

  @IsString()
  @IsOptional()
  uom?: string;

  @IsString()
  @IsOptional()
  fromLocation?: string;

  @IsString()
  @IsOptional()
  toLocation?: string;

  @IsString()
  @IsOptional()
  orderCode?: string;

  @IsString()
  @IsOptional()
  operation?: string;

  @IsString()
  @IsOptional()
  machineCode?: string;

  @IsString()
  @IsOptional()
  by?: string;

  @IsString()
  @IsOptional()
  reason?: string;

  @IsString()
  @IsOptional()
  note?: string;

  @IsOptional()
  metadata?: any;
}