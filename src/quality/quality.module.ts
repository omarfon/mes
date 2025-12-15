import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QualityInspection } from './entities/inspection.entity';
import { Defect } from './entities/defect.entity';
import { InspectionDefect } from './entities/inspection-defect.entity';



import { TraceNode } from '../traceability/entities/trace-node.entity';
import { InspectionsController } from './inspection/inspection.controller';
import { InspectionsService } from './inspection/inspection.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QualityInspection,
      Defect,
      InspectionDefect,
      TraceNode,
    ]),
  ],
  controllers: [InspectionsController],
  providers: [InspectionsService],
  exports: [InspectionsService],
})
export class QualityModule {}
