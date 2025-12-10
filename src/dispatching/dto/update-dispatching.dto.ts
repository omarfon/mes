import { PartialType } from '@nestjs/mapped-types';
import { CreateDispatchingDto } from './create-dispatching.dto';

export class UpdateDispatchingDto extends PartialType(CreateDispatchingDto) {}
