import { PartialType } from '@nestjs/mapped-types';
import { CreateRuleDto } from './create-rule.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateRuleDto extends PartialType(CreateRuleDto) {
  @IsOptional()
  @IsString()
  updatedBy?: string;
}
