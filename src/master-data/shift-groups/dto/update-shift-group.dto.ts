import { PartialType } from '@nestjs/mapped-types';
import { CreateShiftGroupDto } from './create-shift-group.dto';

export class UpdateShiftGroupDto extends PartialType(CreateShiftGroupDto) {}
