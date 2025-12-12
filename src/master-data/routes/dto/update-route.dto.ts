import { PartialType } from '@nestjs/mapped-types';
import { CreateRouteDto, CreateRouteOperationDto } from './create-route.dto';
import {
  IsArray,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateRouteDto extends PartialType(CreateRouteDto) {
  /**
   * Si quieres permitir reemplazar todas las operaciones
   * de la ruta en una actualización.
   */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRouteOperationDto)
  operations?: CreateRouteOperationDto[];
}
