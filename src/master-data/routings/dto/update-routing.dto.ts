import { PartialType } from '@nestjs/mapped-types';
import { CreateRoutingDto, CreateRoutingStepDto } from './create-routing.dto';

export class UpdateRoutingDto extends PartialType(CreateRoutingDto) {}
export class UpdateRoutingStepDto extends PartialType(CreateRoutingStepDto) {}
