import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsDateString, IsUUID, Min, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoOrden, PrioridadOrden } from '../entities/orden.entity';

export class CreateOrdenDto {
  @ApiProperty({ description: 'Número de orden único', example: 'OP-2025-001' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  numeroOrden: string;

  @ApiPropertyOptional({ description: 'ID del producto a fabricar (se puede generar automáticamente desde el código)' })
  @IsOptional()
  @IsUUID()
  productoId?: string;

  @ApiPropertyOptional({ description: 'Código del producto (si no se proporciona productoId)' })
  @IsOptional()
  @IsString()
  productoCodigo?: string;

  @ApiPropertyOptional({ description: 'Nombre del producto' })
  @IsOptional()
  @IsString()
  productoNombre?: string;

  @ApiProperty({ description: 'Cantidad planificada', example: 1000 })
  @IsNumber()
  @Min(0)
  cantidadPlanificada: number;

  @ApiProperty({ description: 'Unidad de medida', example: 'UND' })
  @IsString()
  @IsNotEmpty()
  unidadMedida: string;

  @ApiPropertyOptional({ 
    description: 'Estado de la orden',
    enum: EstadoOrden,
    example: EstadoOrden.PENDIENTE 
  })
  @IsOptional()
  @IsEnum(EstadoOrden)
  estado?: EstadoOrden;

  @ApiPropertyOptional({ 
    description: 'Prioridad de la orden',
    enum: PrioridadOrden,
    example: PrioridadOrden.NORMAL 
  })
  @IsOptional()
  @IsEnum(PrioridadOrden)
  prioridad?: PrioridadOrden;

  @ApiPropertyOptional({ description: 'Fecha planificada de inicio' })
  @IsOptional()
  @IsDateString()
  fechaInicioPlanificada?: string;

  @ApiPropertyOptional({ description: 'Fecha planificada de fin' })
  @IsOptional()
  @IsDateString()
  fechaFinPlanificada?: string;

  @ApiPropertyOptional({ description: 'ID de la ruta de producción' })
  @IsOptional()
  @IsUUID()
  rutaId?: string;

  @ApiPropertyOptional({ description: 'ID del centro de trabajo' })
  @IsOptional()
  @IsUUID()
  workCenterId?: string;

  @ApiPropertyOptional({ description: 'ID del turno' })
  @IsOptional()
  @IsUUID()
  turnoId?: string;

  @ApiPropertyOptional({ description: 'Número de lote' })
  @IsOptional()
  @IsString()
  lote?: string;

  @ApiPropertyOptional({ description: 'Cliente' })
  @IsOptional()
  @IsString()
  cliente?: string;

  @ApiPropertyOptional({ description: 'Pedido de cliente' })
  @IsOptional()
  @IsString()
  pedidoCliente?: string;

  @ApiPropertyOptional({ description: 'Notas o instrucciones' })
  @IsOptional()
  @IsString()
  notas?: string;

  @ApiPropertyOptional({ description: 'Documentos adjuntos (JSON)' })
  @IsOptional()
  documentos?: any;

  @ApiPropertyOptional({ description: 'Parámetros técnicos (JSON)' })
  @IsOptional()
  parametros?: any;

  @ApiPropertyOptional({ description: 'Usuario que crea la orden' })
  @IsOptional()
  @IsUUID()
  creadoPor?: string;
}