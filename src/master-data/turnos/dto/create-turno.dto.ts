import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsArray, IsNumber, Matches, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTurnoDto {
  @ApiProperty({ description: 'Código único del turno', example: 'T1' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  codigo: string;

  @ApiProperty({ description: 'Nombre del turno', example: 'Turno Mañana' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @ApiProperty({ description: 'Hora de inicio (HH:mm)', example: '06:00' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'horaInicio debe estar en formato HH:mm',
  })
  horaInicio: string;

  @ApiProperty({ description: 'Hora de fin (HH:mm)', example: '14:00' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'horaFin debe estar en formato HH:mm',
  })
  horaFin: string;

  @ApiPropertyOptional({ description: 'Duración en horas', example: 8 })
  @IsOptional()
  @IsNumber()
  duracionHoras?: number;

  @ApiPropertyOptional({ description: 'Descripción del turno' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({ description: 'Estado activo', example: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @ApiPropertyOptional({ description: 'Días de la semana (1-7)', example: [1, 2, 3, 4, 5] })
  @IsOptional()
  @IsArray()
  diasSemana?: number[];

  @ApiPropertyOptional({ description: 'Color en formato hex', example: '#3498db' })
  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'color debe ser un código hex válido (ej: #3498db)',
  })
  color?: string;
}
