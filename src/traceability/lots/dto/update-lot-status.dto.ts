import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { LotStatus } from '../entities/lot.entity';

export class UpdateLotStatusDto {
  @IsEnum(LotStatus)
  @IsNotEmpty()
  status: LotStatus;

  @IsString()
  @IsOptional()
  reason?: string;
}
