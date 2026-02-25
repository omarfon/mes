import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InspectionsController } from './inspections.controller';
import { InspectionsService } from './inspections.service';
import { QualityInspection } from '../entities/inspection.entity';
import { InspectionDefect } from '../entities/inspection-defect.entity';
import { Defect } from '../entities/defect.entity';
import { TraceNode } from '../../traceability/entities/trace-node.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QualityInspection,
      InspectionDefect,
      Defect,
      TraceNode,
    ]),
  ],
  controllers: [InspectionsController],
  providers: [InspectionsService],
  exports: [InspectionsService],
})
export class InspectionsModule {}
