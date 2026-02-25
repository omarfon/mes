import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CalendarService } from './calendar.service';

@ApiTags('Maintenance Calendar')
@Controller('maintenance/calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener calendario de mantenimientos' })
  getScheduledMaintenance(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.calendarService.getScheduledMaintenance(new Date(startDate), new Date(endDate));
  }

  @Post('schedule')
  @ApiOperation({ summary: 'Programar actividad de mantenimiento' })
  scheduleActivity(@Body() scheduleDto: any) {
    return this.calendarService.scheduleActivity(scheduleDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar programación' })
  updateSchedule(@Param('id') id: string, @Body() updateScheduleDto: any) {
    return this.calendarService.updateSchedule(id, updateScheduleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancelar programación' })
  cancelSchedule(@Param('id') id: string) {
    return this.calendarService.cancelSchedule(id);
  }
}
