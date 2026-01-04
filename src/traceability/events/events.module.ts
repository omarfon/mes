import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { TraceabilityEvent } from './entities/traceability-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TraceabilityEvent])],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
