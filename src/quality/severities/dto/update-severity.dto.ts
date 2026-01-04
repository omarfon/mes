import { PartialType } from '@nestjs/swagger';
import { CreateSeverityDto } from './create-severity.dto';

export class UpdateSeverityDto extends PartialType(CreateSeverityDto) {}
