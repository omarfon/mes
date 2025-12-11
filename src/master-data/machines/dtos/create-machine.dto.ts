import { IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';

export enum MachineStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE',
}

export class CreateMachineDto {
  @IsString()
  name: string;

  @IsString()
  code: string; // código interno de máquina

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUUID()
  workCenterId?: string; // centro de trabajo / línea

  @IsOptional()
  @IsEnum(MachineStatus)
  status?: MachineStatus;
}

