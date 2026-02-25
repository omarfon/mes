import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ComponentStatus } from '../enums/component-status.enum';

export class FilterComponentsDto {
  @ApiProperty({ description: 'Búsqueda por texto', required: false })
  @IsString()
  @IsOptional()
  q?: string;

  @ApiProperty({ description: 'Filtrar por código de activo', required: false })
  @IsString()
  @IsOptional()
  assetCode?: string;

  @ApiProperty({ enum: ComponentStatus, required: false })
  @IsEnum(ComponentStatus)
  @IsOptional()
  status?: ComponentStatus;
}
