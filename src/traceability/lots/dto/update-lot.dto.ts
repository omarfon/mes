import { PartialType } from '@nestjs/mapped-types';
import { CreateLotDto } from './create-lot.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateLotDto extends PartialType(CreateLotDto) {
  @IsOptional()
  @IsNumber()
  quantityCurrent?: number;
}
