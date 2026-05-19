import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreatePlantCalendarDto } from './dto/create-plant-calendar.dto';
import { UpdatePlantCalendarDto } from './dto/update-plant-calendar.dto';
import { FilterPlantCalendarDto } from './dto/filter-plant-calendar.dto';
import { PlantCalendarService } from './plant-calendar.service';

@Controller('master-data/plant-calendar')
export class PlantCalendarController {
  constructor(private readonly calendarService: PlantCalendarService) {}

  @Post()
  async create(@Body() dto: CreatePlantCalendarDto) {
    return this.calendarService.create(dto);
  }

  @Get()
  async findAll(@Query() filter: FilterPlantCalendarDto) {
    return this.calendarService.findAll(filter);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.calendarService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdatePlantCalendarDto,
  ) {
    return this.calendarService.update(id, dto);
  }

  /**
   * PATCH plant-calendar/:id
   */
  @Patch(':id')
  async patch(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdatePlantCalendarDto,
  ) {
    return this.calendarService.update(id, dto);
  }  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.calendarService.remove(id);
  }
}
