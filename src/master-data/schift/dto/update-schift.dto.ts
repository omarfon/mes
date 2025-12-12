import { PartialType } from '@nestjs/mapped-types';
import { CreateShiftDto } from './create-schift.dto';


export class UpdateShiftDto extends PartialType(CreateShiftDto) {}
