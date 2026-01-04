import { IsEnum, IsNotEmpty } from 'class-validator';
import { AssetStatusEnum } from '../entities/asset-status.entity';

export class ChangeStatusDto {
  @IsEnum(AssetStatusEnum)
  @IsNotEmpty()
  status: AssetStatusEnum;
}
