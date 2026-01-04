// src/production/control-visual/dto/update-control-visual.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateControlVisualDto } from './create-control-visual.dto';

export class UpdateControlVisualDto extends PartialType(CreateControlVisualDto) {}