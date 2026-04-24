import { PartialType } from '@nestjs/mapped-types';
import { CreateBillOfMaterialDto, CreateBomLineDto } from './create-bill-of-material.dto';

export class UpdateBillOfMaterialDto extends PartialType(CreateBillOfMaterialDto) {}
export class UpdateBomLineDto extends PartialType(CreateBomLineDto) {}
