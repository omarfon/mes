import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LabelsService } from './labels.service';
import { LabelsController } from './labels.controller';
import { LabelTemplate } from './entities/label-template.entity';
import { LabelPrintHistory } from './entities/label-print-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LabelTemplate, LabelPrintHistory])],
  controllers: [LabelsController],
  providers: [LabelsService],
  exports: [LabelsService],
})
export class LabelsModule {}
