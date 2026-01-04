import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateAssetStatusDto } from './create-asset-status.dto';
import { AssetStatusEnum } from '../entities/asset-status.entity';

export class UpdateAssetStatusDto extends PartialType(CreateAssetStatusDto) {
  @IsEnum(AssetStatusEnum)
  @IsOptional()
  status?: AssetStatusEnum;
}
