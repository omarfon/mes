import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlantCalendar } from './entities/plant-calendar.entity';
import { PlantCalendarController } from './plant-calendar.controller';
import { PlantCalendarService } from './plant-calendar.service';

import { AuditsModule } from '../../traceability/audits/audits.module';

@Module({
  imports: [TypeOrmModule.forFeature([PlantCalendar]), AuditsModule],
  controllers: [PlantCalendarController],
  providers: [PlantCalendarService],
  exports: [PlantCalendarService, TypeOrmModule],
})
export class PlantCalendarModule {}
