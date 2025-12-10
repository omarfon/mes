import { Test, TestingModule } from '@nestjs/testing';
import { DispatchingController } from './dispatching.controller';
import { DispatchingService } from './dispatching.service';

describe('DispatchingController', () => {
  let controller: DispatchingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DispatchingController],
      providers: [DispatchingService],
    }).compile();

    controller = module.get<DispatchingController>(DispatchingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
