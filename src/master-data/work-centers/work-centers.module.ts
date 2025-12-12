import { Module } from '@nestjs/common';
import { WorkCentersService } from './work-centers.service';
import { WorkCentersController } from './work-centers.controller';

@Module({
  controllers: [WorkCentersController],
  providers: [WorkCentersService],
})
export class WorkCentersModule {}
