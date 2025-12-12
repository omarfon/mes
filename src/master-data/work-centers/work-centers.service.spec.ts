import { Test, TestingModule } from '@nestjs/testing';
import { WorkCentersService } from './work-centers.service';

describe('WorkCentersService', () => {
  let service: WorkCentersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkCentersService],
    }).compile();

    service = module.get<WorkCentersService>(WorkCentersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
