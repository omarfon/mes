import { PartialType } from '@nestjs/mapped-types';
import { CreateIotIngestionDto } from './create-iot-ingestion.dto';

export class UpdateIotIngestionDto extends PartialType(CreateIotIngestionDto) {}
