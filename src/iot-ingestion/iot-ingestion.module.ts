import { Module } from '@nestjs/common';
import { IotIngestionService } from './iot-ingestion.service';
import { IotIngestionController } from './iot-ingestion.controller';

@Module({
  controllers: [IotIngestionController],
  providers: [IotIngestionService],
})
export class IotIngestionModule {}
