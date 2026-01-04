import { PartialType } from '@nestjs/swagger';
import { CreateWIPDto } from './create-wip.dto';
import { IsOptional, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateWIPDto extends PartialType(CreateWIPDto) {
  @ApiPropertyOptional({ description: 'Fecha de última actualización' })
  @IsOptional()
  @IsDateString()
  fechaActualizacion?: string;
}