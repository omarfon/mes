import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TraceabilityService } from './traceability.service';
import { TraceabilityController } from './traceability.controller';
import { TraceNode } from './entities/trace-node.entity';
import { TraceLink } from './entities/trace-link.entity';
import { Product } from 'src/master-data/products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TraceNode, TraceLink, Product])],
  controllers: [TraceabilityController],
  providers: [TraceabilityService],
})
export class TraceabilityModule {}
