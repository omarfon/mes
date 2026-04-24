import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlantCalendar } from './entities/plant-calendar.entity';
import { PlantCalendarController } from './plant-calendar.controller';
import { PlantCalendarService } from './plant-calendar.service';

@Module({
  imports: [TypeOrmModule.forFeature([PlantCalendar])],
  controllers: [PlantCalendarController],
  providers: [PlantCalendarService],
  exports: [PlantCalendarService, TypeOrmModule],
})
export class PlantCalendarModule {}
