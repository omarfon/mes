import { PartialType } from '@nestjs/swagger';
import { CreateLabelTemplateDto } from './create-label-template.dto';

export class UpdateLabelTemplateDto extends PartialType(CreateLabelTemplateDto) {}
