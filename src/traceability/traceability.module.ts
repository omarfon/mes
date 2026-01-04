import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TraceabilityService } from './traceability.service';
import { TraceabilityController } from './traceability.controller';
import { TraceNode } from './entities/trace-node.entity';
import { TraceLink } from './entities/trace-link.entity';
import { Product } from 'src/master-data/products/entities/product.entity';

// Sub-modules
import { LotsModule } from './lots/lots.module';
import { MovementsModule } from './movements/movements.module';
import { GenealogyModule } from './genealogy/genealogy.module';
import { SerialsModule } from './serials/serials.module';
import { LocationsModule } from './locations/locations.module';
import { LabelsModule } from './labels/labels.module';
import { EventsModule } from './events/events.module';
import { AuditsModule } from './audits/audits.module';

// Aggregator
import { TraceabilityAggregatorService } from './traceability-aggregator.service';
import { TraceabilityAggregatorController } from './traceability-aggregator.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([TraceNode, TraceLink, Product]),
    LotsModule,
    MovementsModule,
    GenealogyModule,
    SerialsModule,
    LocationsModule,
    LabelsModule,
    EventsModule,
    AuditsModule,
  ],
  controllers: [TraceabilityController, TraceabilityAggregatorController],
  providers: [TraceabilityService, TraceabilityAggregatorService],
  exports: [TraceabilityService, TraceabilityAggregatorService],
})
export class TraceabilityModule {}
