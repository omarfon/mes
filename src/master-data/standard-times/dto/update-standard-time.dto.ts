import { PartialType } from '@nestjs/mapped-types';
import { CreateStandardTimeDto } from './create-standard-time.dto';

export class UpdateStandardTimeDto extends PartialType(CreateStandardTimeDto) {}
