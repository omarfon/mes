import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsInt,
  IsDateString,
  IsObject,
  IsArray,
  ValidateNested,
  Min,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  RuleEventType,
  RulePriority,
  RuleStatus,
  RuleScope,
  LogicalOperator,
} from '../types/rule-enums';
import type { ConditionGroup, ActionDefinition } from '../types/rule-types';

export class CreateRuleDto {
  @IsString()
  @MinLength(3)
  code!: string;

  @IsString()
  @MinLength(3)
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(RuleEventType)
  eventType!: RuleEventType;

  @IsOptional()
  @IsEnum(RulePriority)
  priority?: RulePriority;

  @IsOptional()
  @IsInt()
  @Min(1)
  executionOrder?: number;

  @IsOptional()
  @IsEnum(RuleScope)
  scope?: RuleScope;

  @IsOptional()
  @IsString()
  scopeValue?: string;

  @IsOptional()
  @IsObject()
  conditions?: ConditionGroup;

  @IsOptional()
  @IsEnum(LogicalOperator)
  conditionsOperator?: LogicalOperator;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object) // ActionDefinition es un tipo, no una clase
  actions!: ActionDefinition[];

  @IsOptional()
  @IsEnum(RuleStatus)
  status?: RuleStatus;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsDateString()
  validFrom?: string;

  @IsOptional()
  @IsDateString()
  validTo?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxExecutionsPerDay?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  cooldownMinutes?: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsString()
  createdBy?: string;
}
