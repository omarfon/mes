import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddDefectDto {
  @ApiProperty({ description: 'ID del defecto' })
  @IsNotEmpty()
  @IsString()
  defectId: string;

  @ApiProperty({ description: 'Cantidad encontrada' })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiPropertyOptional({ description: 'Notas adicionales' })
  @IsOptional()
  @IsString()
  notes?: string;
}
