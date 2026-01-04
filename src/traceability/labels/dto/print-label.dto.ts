import { IsNotEmpty, IsString, IsOptional, IsNumber, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PrintLabelDto {
  @ApiProperty({ description: 'ID de la plantilla a imprimir' })
  @IsNotEmpty()
  @IsString()
  templateId: string;

  @ApiProperty({ description: 'Nombre de la impresora' })
  @IsNotEmpty()
  @IsString()
  printerName: string;

  @ApiPropertyOptional({ description: 'ID del lote' })
  @IsOptional()
  @IsString()
  lotId?: string;

  @ApiPropertyOptional({ description: 'ID del serial' })
  @IsOptional()
  @IsString()
  serialId?: string;

  @ApiPropertyOptional({ description: 'Número de copias', default: 1 })
  @IsOptional()
  @IsNumber()
  copiesPrinted?: number;

  @ApiPropertyOptional({ description: 'Datos adicionales para la plantilla' })
  @IsOptional()
  @IsObject()
  printData?: any;
}
