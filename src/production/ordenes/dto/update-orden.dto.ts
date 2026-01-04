import { PartialType } from '@nestjs/swagger';
import { CreateOrdenDto } from './create-orden.dto';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOrdenDto extends PartialType(CreateOrdenDto) {
  @ApiPropertyOptional({ 
    description: 'Cantidad producida hasta el momento',
    example: 500,
    minimum: 0
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  cantidadProducida?: number;
}