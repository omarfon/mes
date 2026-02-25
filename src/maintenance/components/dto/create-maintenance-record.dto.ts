import { IsString, IsEnum, IsInt, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MaintenanceRecordType } from '../enums/maintenance-record-type.enum';

export class CreateMaintenanceRecordDto {
  @ApiProperty({ enum: MaintenanceRecordType, example: MaintenanceRecordType.INSPECTION })
  @IsEnum(MaintenanceRecordType)
  type: MaintenanceRecordType;

  @ApiProperty({ description: 'Nombre del técnico', example: 'Juan Pérez' })
  @IsString()
  technician: string;

  @ApiProperty({ description: 'Horas de operación al momento del mantenimiento', required: false, example: 500 })
  @IsInt()
  @IsOptional()
  hoursAtMaintenance?: number;

  @ApiProperty({ description: 'Notas del mantenimiento', required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ description: 'Fecha del mantenimiento', example: '2024-01-15' })
  @IsDateString()
  date: Date;
}
