import { Test, TestingModule } from '@nestjs/testing';
import { WorkCentersController } from './work-centers.controller';
import { WorkCentersService } from './work-centers.service';

describe('WorkCentersController', () => {
  let controller: WorkCentersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkCentersController],
      providers: [WorkCentersService],
    }).compile();

    controller = module.get<WorkCentersController>(WorkCentersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
