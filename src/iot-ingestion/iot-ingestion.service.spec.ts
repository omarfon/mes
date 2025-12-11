import { Test, TestingModule } from '@nestjs/testing';
import { IotIngestionService } from './iot-ingestion.service';

describe('IotIngestionService', () => {
  let service: IotIngestionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IotIngestionService],
    }).compile();

    service = module.get<IotIngestionService>(IotIngestionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
