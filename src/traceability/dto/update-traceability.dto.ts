import { PartialType } from '@nestjs/mapped-types';
import { CreateTraceabilityDto } from './create-traceability.dto';

export class UpdateTraceabilityDto extends PartialType(CreateTraceabilityDto) {}
