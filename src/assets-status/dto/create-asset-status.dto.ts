import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { AssetStatusEnum } from '../entities/asset-status.entity';

export class CreateAssetStatusDto {
  @IsUUID()
  @IsNotEmpty()
  assetId: string;

  @IsString()
  @IsNotEmpty()
  assetCode: string;

  @IsString()
  @IsNotEmpty()
  assetName: string;

  @IsEnum(AssetStatusEnum)
  @IsOptional()
  status?: AssetStatusEnum;

  @IsUUID()
  @IsOptional()
  operatorId?: string;

  @IsString()
  @IsOptional()
  operatorName?: string;

  @IsUUID()
  @IsOptional()
  shiftId?: string;

  @IsOptional()
  metadata?: any;
}
