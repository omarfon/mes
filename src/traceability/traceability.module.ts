import { Module } from '@nestjs/common';
import { TraceabilityService } from './traceability.service';
import { TraceabilityController } from './traceability.controller';

@Module({
  imports: [TraceabilityModule],
  controllers: [TraceabilityController],
  providers: [TraceabilityService],
})
export class TraceabilityModule {}
