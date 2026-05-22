import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workstation } from './entities/workstation.entity';
import { WorkstationsController } from './workstations.controller';
import { WorkstationsService } from './workstations.service';

import { AuditsModule } from '../../traceability/audits/audits.module';

@Module({
  imports: [TypeOrmModule.forFeature([Workstation]), AuditsModule],
  controllers: [WorkstationsController],
  providers: [WorkstationsService],
  exports: [WorkstationsService, TypeOrmModule],
})
export class WorkstationsModule {}
