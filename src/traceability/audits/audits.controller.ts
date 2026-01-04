import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Query, 
  Request,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiQuery,
} from '@nestjs/swagger';
import { AuditsService } from './audits.service';
import { CreateAuditDto } from './dto/create-audit.dto';
import { FilterAuditDto } from './dto/filter-audit.dto';

@ApiTags('Auditoría')
@Controller('audit')
export class AuditsController {
  constructor(private readonly auditsService: AuditsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear registro de auditoría' })
  @ApiResponse({ status: 201, description: 'Registro creado exitosamente' })
  create(@Body() createAuditDto: CreateAuditDto, @Request() req) {
    // Agregar información del usuario desde el token si está autenticado
    if (!createAuditDto.userId && req.user) {
      createAuditDto.userId = req.user.userId;
    }
    return this.auditsService.create(createAuditDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los registros de auditoría con filtros' })
  @ApiResponse({ status: 200, description: 'Lista de registros de auditoría' })
  findAll(@Query() filterDto: FilterAuditDto) {
    return this.auditsService.findAll(filterDto);
  }

  @Get('stats/by-action')
  @ApiOperation({ summary: 'Obtener estadísticas por tipo de acción' })
  @ApiResponse({ status: 200, description: 'Estadísticas por acción' })
  getStatsByAction() {
    return this.auditsService.getStatsByAction();
  }

  @Get('stats/by-entity-type')
  @ApiOperation({ summary: 'Obtener estadísticas por tipo de entidad' })
  @ApiResponse({ status: 200, description: 'Estadísticas por tipo de entidad' })
  getStatsByEntityType() {
    return this.auditsService.getStatsByEntityType();
  }

  @Get('timeline')
  @ApiOperation({ summary: 'Obtener línea de tiempo de actividad' })
  @ApiQuery({ name: 'days', required: false, description: 'Días hacia atrás (default: 7)' })
  @ApiResponse({ status: 200, description: 'Línea de tiempo de actividad' })
  getActivityTimeline(@Query('days') days?: number) {
    return this.auditsService.getActivityTimeline(days ? Number(days) : 7);
  }

  @Get('entity/:entityType/:entityId')
  @ApiOperation({ summary: 'Obtener auditoría de una entidad específica' })
  @ApiResponse({ status: 200, description: 'Registros de auditoría de la entidad' })
  findByEntity(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ) {
    return this.auditsService.findByEntity(entityType, entityId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Obtener auditoría de un usuario específico' })
  @ApiQuery({ name: 'limit', required: false, description: 'Límite de registros (default: 50)' })
  @ApiResponse({ status: 200, description: 'Registros de auditoría del usuario' })
  findByUser(
    @Param('userId') userId: string,
    @Query('limit') limit?: number,
  ) {
    return this.auditsService.findByUser(userId, limit ? Number(limit) : 50);
  }

  @Get('user/:userId/activity')
  @ApiOperation({ summary: 'Obtener actividad detallada de un usuario' })
  @ApiQuery({ name: 'days', required: false, description: 'Días hacia atrás (default: 30)' })
  @ApiResponse({ status: 200, description: 'Actividad detallada del usuario' })
  getUserActivity(
    @Param('userId') userId: string,
    @Query('days') days?: number,
  ) {
    return this.auditsService.getUserActivity(userId, days ? Number(days) : 30);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un registro de auditoría por ID' })
  @ApiResponse({ status: 200, description: 'Registro de auditoría encontrado' })
  @ApiResponse({ status: 404, description: 'Registro no encontrado' })
  findOne(@Param('id') id: string) {
    return this.auditsService.findOne(id);
  }
}
