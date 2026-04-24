import { IsString, IsEnum, IsOptional, IsObject, IsUUID } from 'class-validator';
import { RuleEventType } from '../types/rule-enums';

export class TriggerRuleDto {
  @IsEnum(RuleEventType)
  eventType!: RuleEventType;

  @IsString()
  entityType!: string;

  @IsString()
  entityId!: string;

  @IsObject()
  entityData!: any;

  @IsOptional()
  @IsString()
  plantCode?: string;

  @IsOptional()
  @IsString()
  areaCode?: string;

  @IsOptional()
  @IsString()
  workCenterCode?: string;

  @IsOptional()
  @IsString()
  machineCode?: string;

  @IsOptional()
  @IsString()
  productCode?: string;

  @IsOptional()
  @IsString()
  orderTypeCode?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class ExecuteRuleDto {
  @IsUUID()
  ruleId!: string;

  @IsObject()
  context!: {
    eventType: string;
    entityType: string;
    entityId: string;
    entityData: any;
    [key: string]: any;
  };
}
