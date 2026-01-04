import { IsUUID, IsNotEmpty, IsOptional, IsString, IsNumber, IsDateString, MaxLength, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWIPDto {
  @ApiProperty({ description: 'ID de la orden de producción' })
  @IsUUID()
  @IsNotEmpty()
  ordenId: string;

  @ApiProperty({ description: 'ID del producto' })
  @IsUUID()
  @IsNotEmpty()
  productoId: string;

  @ApiProperty({ description: 'Nombre del producto', example: 'Tela Jersey 180g' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  productoNombre: string;

  @ApiPropertyOptional({ description: 'ID del centro de trabajo' })
  @IsOptional()
  @IsUUID()
  workCenterId?: string;

  @ApiPropertyOptional({ description: 'Nombre del centro de trabajo' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  workCenterNombre?: string;

  @ApiProperty({ description: 'Cantidad actual en proceso', example: 100 })
  @IsNumber()
  @Min(0)
  cantidadActual: number;

  @ApiProperty({ description: 'Unidad de medida', example: 'KG' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  unidadMedida: string;

  @ApiPropertyOptional({ description: 'Número de lote' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  lote?: string;

  @ApiPropertyOptional({ description: 'Ubicación física' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  ubicacion?: string;

  @ApiProperty({ description: 'Fecha de entrada al proceso' })
  @IsDateString()
  @IsNotEmpty()
  fechaEntrada: string;

  @ApiPropertyOptional({ description: 'Movimientos históricos (JSON)' })
  @IsOptional()
  movimientos?: any;
}