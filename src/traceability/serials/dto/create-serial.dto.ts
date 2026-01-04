import { IsNotEmpty, IsString, IsEnum, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SerialStatus } from '../entities/serial.entity';

export class CreateSerialDto {
  @ApiProperty({ description: 'Número de serie único' })
  @IsNotEmpty()
  @IsString()
  serialNumber: string;

  @ApiProperty({ description: 'ID del lote' })
  @IsNotEmpty()
  @IsString()
  lotId: string;

  @ApiProperty({ description: 'ID del producto' })
  @IsNotEmpty()
  @IsString()
  productId: string;

  @ApiPropertyOptional({ enum: SerialStatus })
  @IsOptional()
  @IsEnum(SerialStatus)
  status?: SerialStatus;

  @ApiPropertyOptional({ description: 'Dirección MAC' })
  @IsOptional()
  @IsString()
  macAddress?: string;

  @ApiPropertyOptional({ description: 'IMEI' })
  @IsOptional()
  @IsString()
  imei?: string;

  @ApiPropertyOptional({ description: 'Versión de firmware' })
  @IsOptional()
  @IsString()
  firmwareVersion?: string;

  @ApiPropertyOptional({ description: 'Revisión de hardware' })
  @IsOptional()
  @IsString()
  hardwareRevision?: string;

  @ApiPropertyOptional({ description: 'Fecha de inicio de garantía' })
  @IsOptional()
  @IsDateString()
  warrantyStartDate?: Date;

  @ApiPropertyOptional({ description: 'Fecha de fin de garantía' })
  @IsOptional()
  @IsDateString()
  warrantyEndDate?: Date;

  @ApiPropertyOptional({ description: 'Meses de garantía' })
  @IsOptional()
  @IsNumber()
  warrantyMonths?: number;

  @ApiPropertyOptional({ description: 'Fecha de fabricación' })
  @IsOptional()
  @IsDateString()
  manufacturedDate?: Date;

  @ApiPropertyOptional({ description: 'Fecha de envío' })
  @IsOptional()
  @IsDateString()
  shippedDate?: Date;

  @ApiPropertyOptional({ description: 'ID del cliente' })
  @IsOptional()
  @IsString()
  customerId?: string;

  @ApiPropertyOptional({ description: 'Notas adicionales' })
  @IsOptional()
  @IsString()
  notes?: string;
}
