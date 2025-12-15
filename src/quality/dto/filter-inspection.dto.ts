import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { InspectionStatus, InspectionType } from '../entities/inspection.entity';

export class FilterInspectionsDto {
  @ApiPropertyOptional({ enum: InspectionType })
  @IsOptional()
  @IsEnum(InspectionType)
  type?: InspectionType;

  @ApiPropertyOptional({ enum: InspectionStatus })
  @IsOptional()
  @IsEnum(InspectionStatus)
  status?: InspectionStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  nodeId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}
