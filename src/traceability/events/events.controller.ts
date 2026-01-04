import { Controller, Get, Post, Body, Query, Param, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { FilterEventDto } from './dto/filter-event.dto';
import { EventType } from './entities/traceability-event.entity';

@ApiTags('Traceability - Events')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('traceability/events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo evento de trazabilidad' })
  @ApiResponse({ status: 201, description: 'Evento creado exitosamente' })
  create(@Request() req, @Body() createDto: CreateEventDto) {
    return this.eventsService.create(req.user.userId, createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los eventos con filtros opcionales' })
  @ApiResponse({ status: 200, description: 'Lista de eventos' })
  findAll(@Query() filterDto: FilterEventDto) {
    return this.eventsService.findAll({
      entityType: filterDto.entityType,
      entityId: filterDto.entityId,
      eventType: filterDto.eventType,
      userId: filterDto.userId,
      startDate: filterDto.startDate ? new Date(filterDto.startDate) : undefined,
      endDate: filterDto.endDate ? new Date(filterDto.endDate) : undefined,
    });
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obtener estadísticas de eventos' })
  @ApiResponse({ status: 200, description: 'Estadísticas de eventos por tipo' })
  getEventStats(@Query('entityType') entityType?: string) {
    return this.eventsService.getEventStats(entityType);
  }

  @Get(':entityType/:entityId')
  @ApiOperation({ summary: 'Obtener eventos de una entidad específica' })
  @ApiResponse({ status: 200, description: 'Lista de eventos de la entidad' })
  findByEntity(@Param('entityType') entityType: string, @Param('entityId') entityId: string) {
    return this.eventsService.findByEntity(entityType, entityId);
  }
}
