import { PartialType } from '@nestjs/swagger';
import { CreateSerialDto } from './create-serial.dto';

export class UpdateSerialDto extends PartialType(CreateSerialDto) {}
