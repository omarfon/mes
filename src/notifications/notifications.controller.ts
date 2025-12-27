import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Patch,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { FilterNotificationsDto } from './dto/filter-notifications.dto';

@ApiTags('Notificaciones')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva notificación' })
  async create(@Body() dto: CreateNotificationDto) {
    return this.notificationsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar notificaciones con filtros y paginación' })
  async findAll(@Query() filter: FilterNotificationsDto) {
    return this.notificationsService.findAll(filter);
  }

  @Get('unread-count/:userId')
  @ApiOperation({ summary: 'Contar notificaciones no leídas de un usuario' })
  async countUnread(@Param('userId', new ParseUUIDPipe()) userId: string) {
    const count = await this.notificationsService.countUnread(userId);
    return { count };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una notificación por ID' })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.notificationsService.findOne(id);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Marcar notificación como leída' })
  async markAsRead(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.notificationsService.markAsRead(id);
  }

  @Patch('mark-all-read/:userId')
  @ApiOperation({ summary: 'Marcar todas las notificaciones de un usuario como leídas' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async markAllAsRead(@Param('userId', new ParseUUIDPipe()) userId: string): Promise<void> {
    await this.notificationsService.markAllAsRead(userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una notificación' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.notificationsService.remove(id);
  }
}
