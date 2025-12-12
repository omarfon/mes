import { Test, TestingModule } from '@nestjs/testing';
import { SchiftService } from './schift.service';

describe('SchiftService', () => {
  let service: SchiftService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SchiftService],
    }).compile();

    service = module.get<SchiftService>(SchiftService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
