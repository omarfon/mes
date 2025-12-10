import { Module } from '@nestjs/common';
import { DispatchingService } from './dispatching.service';
import { DispatchingController } from './dispatching.controller';

@Module({
  controllers: [DispatchingController],
  providers: [DispatchingService],
})
export class DispatchingModule {}
