import { IsString, IsNotEmpty, IsOptional, IsEnum, IsEmail, IsUUID, IsArray, IsDateString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoOperador, NivelHabilidad } from '../entities/operador.entity';

export class CreateOperadorDto {
  @ApiProperty({ description: 'Código único del operador', example: 'OP001' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  codigo: string;

  @ApiPropertyOptional({ description: 'Número de empleado', example: 'EMP-2024-001' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  numeroEmpleado?: string;

  @ApiProperty({ description: 'Nombre del operador', example: 'Juan' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @ApiProperty({ description: 'Apellidos del operador', example: 'García López' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  apellidos: string;

  @ApiPropertyOptional({ description: 'Email del operador', example: 'juan.garcia@empresa.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Teléfono del operador', example: '+34 600 123 456' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefono?: string;

  @ApiPropertyOptional({ 
    description: 'Estado del operador',
    enum: EstadoOperador,
    example: EstadoOperador.ACTIVO 
  })
  @IsOptional()
  @IsEnum(EstadoOperador)
  estado?: EstadoOperador;

  @ApiPropertyOptional({ 
    description: 'Nivel de habilidad',
    enum: NivelHabilidad,
    example: NivelHabilidad.INTERMEDIO 
  })
  @IsOptional()
  @IsEnum(NivelHabilidad)
  nivelHabilidad?: NivelHabilidad;

  @ApiPropertyOptional({ description: 'Departamento', example: 'Producción' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  departamento?: string;

  @ApiPropertyOptional({ description: 'Puesto', example: 'Operador de máquina CNC' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  puesto?: string;

  @ApiPropertyOptional({ description: 'ID del turno asignado' })
  @IsOptional()
  @IsUUID()
  turnoId?: string;

  @ApiPropertyOptional({ description: 'ID del centro de trabajo' })
  @IsOptional()
  @IsUUID()
  workCenterId?: string;

  @ApiPropertyOptional({ description: 'ID del supervisor' })
  @IsOptional()
  @IsUUID()
  supervisorId?: string;

  @ApiPropertyOptional({ description: 'Fecha de ingreso', example: '2024-01-15' })
  @IsOptional()
  @IsDateString()
  fechaIngreso?: string;

  @ApiPropertyOptional({ description: 'Certificaciones', example: ['ISO 9001', 'Seguridad Industrial'] })
  @IsOptional()
  @IsArray()
  certificaciones?: string[];

  @ApiPropertyOptional({ description: 'Habilidades', example: ['CNC', 'Soldadura', 'Control de calidad'] })
  @IsOptional()
  @IsArray()
  habilidades?: string[];

  @ApiPropertyOptional({ description: 'IDs de máquinas autorizadas' })
  @IsOptional()
  @IsArray()
  maquinasAutorizadas?: string[];

  @ApiPropertyOptional({ description: 'Notas adicionales' })
  @IsOptional()
  @IsString()
  notas?: string;

  @ApiPropertyOptional({ description: 'URL de la foto del operador' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  foto?: string;

  @ApiPropertyOptional({ description: 'ID del usuario del sistema' })
  @IsOptional()
  @IsUUID()
  userId?: string;
}
