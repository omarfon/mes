import { PartialType } from '@nestjs/mapped-types';

import { IsNumber, IsOptional } from 'class-validator';
import { CreateLotDto } from 'src/traceability/lots/dto/create-lot.dto';

export class UpdateLotDto extends PartialType(CreateLotDto) {
 @IsNumber()
  @IsOptional()
  quantityCurrent?: number;

  @IsNumber()
  @IsOptional()
  quantityReserved?: number;

  @IsNumber()
  @IsOptional()
  quantityBlocked?: number;
}