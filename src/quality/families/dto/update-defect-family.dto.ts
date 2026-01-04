import { PartialType } from '@nestjs/swagger';
import { CreateDefectFamilyDto } from './create-defect-family.dto';

export class UpdateDefectFamilyDto extends PartialType(CreateDefectFamilyDto) {}
