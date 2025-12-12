import { Test, TestingModule } from '@nestjs/testing';
import { SchiftController } from './schift.controller';
import { SchiftService } from './schift.service';

describe('SchiftController', () => {
  let controller: SchiftController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchiftController],
      providers: [SchiftService],
    }).compile();

    controller = module.get<SchiftController>(SchiftController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
