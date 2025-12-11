import { Test, TestingModule } from '@nestjs/testing';
import { IotIngestionController } from './iot-ingestion.controller';
import { IotIngestionService } from './iot-ingestion.service';

describe('IotIngestionController', () => {
  let controller: IotIngestionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IotIngestionController],
      providers: [IotIngestionService],
    }).compile();

    controller = module.get<IotIngestionController>(IotIngestionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
