import { PartialType } from '@nestjs/mapped-types';
import { CreateMaterialLotDto } from './create-material-lot.dto';

export class UpdateMaterialLotDto extends PartialType(CreateMaterialLotDto) {}
