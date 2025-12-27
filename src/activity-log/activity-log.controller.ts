import { Controller, Get, Post, Body, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ActivityLogService } from './activity-log.service';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';
import { FilterActivityLogDto } from './dto/filter-activity-log.dto';

@ApiTags('Activity Log')
@Controller('activity-log')
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @Post()
  @ApiOperation({ summary: 'Crear registro de actividad' })
  async create(@Body() dto: CreateActivityLogDto) {
    return this.activityLogService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar registros de actividad con filtros' })
  async findAll(@Query() filter: FilterActivityLogDto) {
    return this.activityLogService.findAll(filter);
  }

  @Get('entity/:type/:id')
  @ApiOperation({ summary: 'Obtener historial de una entidad específica' })
  async findByEntity(
    @Param('type') entityType: string,
    @Param('id') entityId: string,
  ) {
    return this.activityLogService.findByEntity(entityType, entityId);
  }

  @Get('stats/:userId')
  @ApiOperation({ summary: 'Obtener estadísticas de actividad por usuario' })
  async getStatsByUser(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Query('days') days?: number,
  ) {
    return this.activityLogService.getStatsByUser(userId, days || 30);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un registro por ID' })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.activityLogService.findOne(id);
  }
}
