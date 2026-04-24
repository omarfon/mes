import { PartialType } from '@nestjs/mapped-types';
import { CreatePlantCalendarDto } from './create-plant-calendar.dto';

export class UpdatePlantCalendarDto extends PartialType(CreatePlantCalendarDto) {}
