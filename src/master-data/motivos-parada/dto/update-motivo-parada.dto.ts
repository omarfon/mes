import { PartialType } from '@nestjs/swagger';
import { CreateMotivoParadaDto } from './create-motivo-parada.dto';

export class UpdateMotivoParadaDto extends PartialType(CreateMotivoParadaDto) {}
