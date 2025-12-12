import { PartialType } from '@nestjs/mapped-types';
import { CreateSchiftDto } from './create-schift.dto';

export class UpdateSchiftDto extends PartialType(CreateSchiftDto) {}
