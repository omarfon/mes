import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkCenter } from './entities/work-center.entity';
import { WorkCentersController } from './work-centers.controller';
import { WorkCentersService } from './work-centers.service';


import { AuditsModule } from '../../traceability/audits/audits.module';

@Module({
  imports: [TypeOrmModule.forFeature([WorkCenter]), AuditsModule],
  controllers: [WorkCentersController],
  providers: [WorkCentersService],
  exports: [WorkCentersService, TypeOrmModule],
})
export class WorkCentersModule {}
