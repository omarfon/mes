import { PartialType } from '@nestjs/mapped-types';
import { CreateScrapReasonDto } from './create-scrap-reason.dto';

export class UpdateScrapReasonDto extends PartialType(CreateScrapReasonDto) {}
