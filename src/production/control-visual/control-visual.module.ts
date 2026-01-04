// src/production/control-visual/control-visual.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ControlVisual } from './entities/control-visual.entity';
import { ControlVisualService } from './control-visual.service';
import { ControlVisualController } from './control-visual.controller';
import { MachinesModule } from '../../master-data/machines/machines.module';
import { WorkCentersModule } from '../../master-data/work-centers/work-centers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ControlVisual]),
    MachinesModule,
    WorkCentersModule,
  ],
  controllers: [ControlVisualController],
  providers: [ControlVisualService],
  exports: [ControlVisualService, TypeOrmModule],
})
export class ControlVisualModule {}