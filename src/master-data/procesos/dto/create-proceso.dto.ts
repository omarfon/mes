import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsInt, IsArray, IsObject, Min, Max, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TipoProceso, EstadoProceso } from '../entities/proceso.entity';

export class CreateProcesoDto {
  @ApiProperty({ description: 'Código único del proceso', example: 'PROC-001' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  codigo: string;

  @ApiProperty({ description: 'Nombre del proceso', example: 'Ensamble de motor' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombre: string;

  @ApiPropertyOptional({ description: 'Descripción detallada del proceso' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ 
    description: 'Tipo de proceso',
    enum: TipoProceso,
    example: TipoProceso.MANUFACTURA 
  })
  @IsEnum(TipoProceso)
  @IsNotEmpty()
  tipo: TipoProceso;

  @ApiPropertyOptional({ 
    description: 'Estado del proceso',
    enum: EstadoProceso,
    example: EstadoProceso.ACTIVO 
  })
  @IsOptional()
  @IsEnum(EstadoProceso)
  estado?: EstadoProceso;

  @ApiPropertyOptional({ description: 'Versión del proceso', example: '1.0' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  version?: string;

  @ApiPropertyOptional({ description: 'Tiempo estándar en minutos', example: 45.5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  tiempoEstandarMinutos?: number;

  @ApiPropertyOptional({ description: 'Tiempo de setup en minutos', example: 15 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  tiempoSetupMinutos?: number;

  @ApiPropertyOptional({ description: 'Instrucciones de trabajo' })
  @IsOptional()
  @IsString()
  instrucciones?: string;

  @ApiPropertyOptional({ description: 'Requisitos de calidad' })
  @IsOptional()
  @IsString()
  requisitosCalidad?: string;

  @ApiPropertyOptional({ description: 'Parámetros del proceso', example: { temperatura: 180, presion: 5 } })
  @IsOptional()
  @IsObject()
  parametros?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Recursos necesarios', example: ['Destornillador', 'Llave inglesa'] })
  @IsOptional()
  @IsArray()
  recursos?: string[];

  @ApiPropertyOptional({ description: 'Habilidades requeridas', example: ['Soldadura', 'Control numérico'] })
  @IsOptional()
  @IsArray()
  habilidadesRequeridas?: string[];

  @ApiPropertyOptional({ description: 'ID del centro de trabajo' })
  @IsOptional()
  @IsString()
  workCenterId?: string;

  @ApiPropertyOptional({ description: 'ID del producto asociado' })
  @IsOptional()
  @IsString()
  productoId?: string;

  @ApiPropertyOptional({ description: 'ID de la ruta de producción' })
  @IsOptional()
  @IsString()
  rutaId?: string;

  @ApiPropertyOptional({ description: 'Secuencia en la ruta', example: 1 })
  @IsOptional()
  @IsInt()
  @Min(0)
  secuencia?: number;

  @ApiPropertyOptional({ description: 'Documentos asociados' })
  @IsOptional()
  @IsArray()
  documentos?: Array<{
    nombre: string;
    tipo: string;
    url: string;
  }>;

  @ApiPropertyOptional({ description: 'Puntos críticos de control', example: ['Control de temperatura', 'Verificación de medidas'] })
  @IsOptional()
  @IsArray()
  puntosCriticos?: string[];

  @ApiPropertyOptional({ description: 'Riesgos asociados', example: ['Quemaduras', 'Cortes'] })
  @IsOptional()
  @IsArray()
  riesgos?: string[];

  @ApiPropertyOptional({ description: 'Eficiencia esperada (%)', example: 85.5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  eficienciaEsperada?: number;

  @ApiPropertyOptional({ description: 'Costo estándar', example: 150.50 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  costoEstandar?: number;

  @ApiPropertyOptional({ description: 'Notas adicionales' })
  @IsOptional()
  @IsString()
  notas?: string;

  @ApiPropertyOptional({ description: 'ID del proceso padre' })
  @IsOptional()
  @IsString()
  procesoPadreId?: string;
}
