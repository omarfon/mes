import { Test, TestingModule } from '@nestjs/testing';
import { TraceabilityController } from './traceability.controller';
import { TraceabilityService } from './traceability.service';

describe('TraceabilityController', () => {
  let controller: TraceabilityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TraceabilityController],
      providers: [TraceabilityService],
    }).compile();

    controller = module.get<TraceabilityController>(TraceabilityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
