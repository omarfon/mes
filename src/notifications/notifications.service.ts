import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { FilterNotificationsDto } from './dto/filter-notifications.dto';
import { PaginatedResponseDto } from '../common/dto/pagination.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
  ) {}

  /**
   * Crear una nueva notificación
   */
  async create(dto: CreateNotificationDto): Promise<Notification> {
    const notification = this.notificationRepo.create(dto);
    return this.notificationRepo.save(notification);
  }

  /**
   * Listar notificaciones con filtros
   */
  async findAll(filter: FilterNotificationsDto): Promise<PaginatedResponseDto<Notification>> {
    const { userId, isRead, type, category, page = 1, limit = 20 } = filter;

    const where: any = {};
    if (userId) where.userId = userId;
    if (isRead !== undefined) where.isRead = isRead;
    if (type) where.type = type;
    if (category) where.category = category;

    const [data, total] = await this.notificationRepo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return new PaginatedResponseDto(data, total, page, limit);
  }

  /**
   * Obtener una notificación por ID
   */
  async findOne(id: string): Promise<Notification> {
    const notification = await this.notificationRepo.findOne({ where: { id } });
    if (!notification) {
      throw new NotFoundException(`Notification ${id} not found`);
    }
    return notification;
  }

  /**
   * Marcar notificación como leída
   */
  async markAsRead(id: string): Promise<Notification> {
    const notification = await this.findOne(id);
    notification.isRead = true;
    return this.notificationRepo.save(notification);
  }

  /**
   * Marcar todas las notificaciones de un usuario como leídas
   */
  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepo.update(
      { userId, isRead: false },
      { isRead: true },
    );
  }

  /**
   * Contar notificaciones no leídas de un usuario
   */
  async countUnread(userId: string): Promise<number> {
    return this.notificationRepo.count({
      where: { userId, isRead: false },
    });
  }

  /**
   * Eliminar notificación
   */
  async remove(id: string): Promise<void> {
    const result = await this.notificationRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Notification ${id} not found`);
    }
  }

  /**
   * Eliminar notificaciones antiguas (por ejemplo, más de 30 días)
   */
  async deleteOld(days: number = 30): Promise<number> {
    const date = new Date();
    date.setDate(date.getDate() - days);

    const result = await this.notificationRepo
      .createQueryBuilder()
      .delete()
      .where('created_at < :date', { date })
      .andWhere('is_read = :isRead', { isRead: true })
      .execute();

    return result.affected || 0;
  }
}
