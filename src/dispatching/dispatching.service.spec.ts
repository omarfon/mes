import { Test, TestingModule } from '@nestjs/testing';
import { DispatchingService } from './dispatching.service';

describe('DispatchingService', () => {
  let service: DispatchingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DispatchingService],
    }).compile();

    service = module.get<DispatchingService>(DispatchingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
