import { PartialType } from '@nestjs/swagger';
import { CreateOperadorDto } from './create-operador.dto';

export class UpdateOperadorDto extends PartialType(CreateOperadorDto) {}
