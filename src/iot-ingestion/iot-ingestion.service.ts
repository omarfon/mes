import { Injectable } from '@nestjs/common';
import { CreateIotIngestionDto } from './dto/create-iot-ingestion.dto';
import { UpdateIotIngestionDto } from './dto/update-iot-ingestion.dto';

@Injectable()
export class IotIngestionService {
  create(createIotIngestionDto: CreateIotIngestionDto) {
    return 'This action adds a new iotIngestion';
  }

  findAll() {
    return `This action returns all iotIngestion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} iotIngestion`;
  }

  update(id: number, updateIotIngestionDto: UpdateIotIngestionDto) {
    return `This action updates a #${id} iotIngestion`;
  }

  remove(id: number) {
    return `This action removes a #${id} iotIngestion`;
  }
}
