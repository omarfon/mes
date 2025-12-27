import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsEnum, IsInt, IsArray, Min, Max, Matches, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CategoriaParada, TipoParada } from '../entities/motivo-parada.entity';

export class CreateMotivoParadaDto {
  @ApiProperty({ description: 'Código único del motivo de parada', example: 'MP001' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  codigo: string;

  @ApiProperty({ description: 'Nombre del motivo', example: 'Falta de material' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombre: string;

  @ApiPropertyOptional({ description: 'Descripción detallada' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ 
    description: 'Categoría del motivo',
    enum: CategoriaParada,
    example: CategoriaParada.MATERIALES 
  })
  @IsEnum(CategoriaParada)
  @IsNotEmpty()
  categoria: CategoriaParada;

  @ApiPropertyOptional({ 
    description: 'Tipo de parada según duración',
    enum: TipoParada,
    example: TipoParada.CORTA 
  })
  @IsOptional()
  @IsEnum(TipoParada)
  tipo?: TipoParada;

  @ApiPropertyOptional({ description: 'Requiere aprobación', example: false })
  @IsOptional()
  @IsBoolean()
  requiereAprobacion?: boolean;

  @ApiPropertyOptional({ description: 'Requiere comentario obligatorio', example: true })
  @IsOptional()
  @IsBoolean()
  requiereComentario?: boolean;

  @ApiPropertyOptional({ description: 'Requiere evidencia', example: false })
  @IsOptional()
  @IsBoolean()
  requiereEvidencia?: boolean;

  @ApiPropertyOptional({ description: 'Color en formato hex', example: '#e74c3c' })
  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'color debe ser un código hex válido (ej: #e74c3c)',
  })
  color?: string;

  @ApiPropertyOptional({ description: 'Icono o emoji', example: '⚠️' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  icono?: string;

  @ApiPropertyOptional({ description: 'Tiempo estándar de resolución en minutos', example: 30 })
  @IsOptional()
  @IsInt()
  @Min(0)
  tiempoEstandardMinutos?: number;

  @ApiPropertyOptional({ description: 'Prioridad (1-5)', example: 3 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  prioridad?: number;

  @ApiPropertyOptional({ description: 'Impacta en OEE', example: true })
  @IsOptional()
  @IsBoolean()
  impactaOEE?: boolean;

  @ApiPropertyOptional({ description: 'Departamento responsable', example: 'Mantenimiento' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  departamentoResponsable?: string;

  @ApiPropertyOptional({ description: 'Acciones correctivas sugeridas', example: ['Verificar stock', 'Contactar proveedor'] })
  @IsOptional()
  @IsArray()
  accionesCorrectivas?: string[];

  @ApiPropertyOptional({ description: 'Estado activo', example: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @ApiPropertyOptional({ description: 'ID del motivo padre' })
  @IsOptional()
  @IsString()
  motivoPadreId?: string;
}
