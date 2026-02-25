import { Module } from '@nestjs/common';
import { DowntimeController } from './downtime.controller';
import { DowntimeService } from './downtime.service';

@Module({
  imports: [],
  controllers: [DowntimeController],
  providers: [DowntimeService],
  exports: [DowntimeService],
})
export class DowntimeModule {}
