import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsDateString, IsUUID, IsArray, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoDespacho, TipoDespacho } from '../entities/despacho.entity';

export class CreateDespachoDto {
  @ApiProperty({ description: 'Número único de despacho', example: 'DESP-2025-001' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  numeroDespacho: string;

  @ApiPropertyOptional({ description: 'ID de la orden de producción' })
  @IsOptional()
  @IsUUID()
  ordenId?: string;

  @ApiPropertyOptional({ description: 'Tipo de despacho', enum: TipoDespacho })
  @IsOptional()
  @IsEnum(TipoDespacho)
  tipo?: TipoDespacho;

  @ApiPropertyOptional({ description: 'Estado del despacho', enum: EstadoDespacho })
  @IsOptional()
  @IsEnum(EstadoDespacho)
  estado?: EstadoDespacho;

  @ApiProperty({ description: 'Destino o cliente' })
  @IsString()
  @IsNotEmpty()
  destino: string;

  @ApiPropertyOptional({ description: 'Dirección de entrega' })
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiPropertyOptional({ description: 'Contacto en destino' })
  @IsOptional()
  @IsString()
  contacto?: string;

  @ApiPropertyOptional({ description: 'Teléfono de contacto' })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiPropertyOptional({ description: 'Fecha programada de despacho' })
  @IsOptional()
  @IsDateString()
  fechaProgramada?: string;

  @ApiProperty({ description: 'Items del despacho (array de objetos)' })
  @IsArray()
  items: any[];

  @ApiPropertyOptional({ description: 'Peso total en kg' })
  @IsOptional()
  @IsNumber()
  pesoTotal?: number;

  @ApiPropertyOptional({ description: 'Volumen total en m3' })
  @IsOptional()
  @IsNumber()
  volumenTotal?: number;

  @ApiPropertyOptional({ description: 'Transportista' })
  @IsOptional()
  @IsString()
  transportista?: string;

  @ApiPropertyOptional({ description: 'Número de guía' })
  @IsOptional()
  @IsString()
  numeroGuia?: string;

  @ApiPropertyOptional({ description: 'Vehículo o placa' })
  @IsOptional()
  @IsString()
  vehiculo?: string;

  @ApiPropertyOptional({ description: 'Conductor' })
  @IsOptional()
  @IsString()
  conductor?: string;

  @ApiPropertyOptional({ description: 'Documentos adjuntos' })
  @IsOptional()
  documentos?: any;

  @ApiPropertyOptional({ description: 'Observaciones' })
  @IsOptional()
  @IsString()
  observaciones?: string;

  @ApiPropertyOptional({ description: 'Usuario que prepara' })
  @IsOptional()
  @IsUUID()
  preparadoPor?: string;
}
