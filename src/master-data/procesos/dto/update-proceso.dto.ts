import { PartialType } from '@nestjs/swagger';
import { CreateProcesoDto } from './create-proceso.dto';

export class UpdateProcesoDto extends PartialType(CreateProcesoDto) {}
