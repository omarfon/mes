import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { ActivityLog } from './entities/activity-log.entity';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';
import { FilterActivityLogDto } from './dto/filter-activity-log.dto';
import { PaginatedResponseDto } from '../common/dto/pagination.dto';

@Injectable()
export class ActivityLogService {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly activityLogRepo: Repository<ActivityLog>,
  ) {}

  /**
   * Crear un registro de actividad
   */
  async create(dto: CreateActivityLogDto): Promise<ActivityLog> {
    const log = this.activityLogRepo.create(dto);
    return this.activityLogRepo.save(log);
  }

  /**
   * Listar actividades con filtros
   */
  async findAll(
    filter: FilterActivityLogDto,
  ): Promise<PaginatedResponseDto<ActivityLog>> {
    const {
      userId,
      module,
      action,
      entityType,
      entityId,
      startDate,
      endDate,
      page = 1,
      limit = 20,
    } = filter;

    const where: any = {};

    if (userId) where.userId = userId;
    if (module) where.module = module;
    if (action) where.action = action;
    if (entityType) where.entityType = entityType;
    if (entityId) where.entityId = entityId;

    // Filtro de rango de fechas
    if (startDate && endDate) {
      where.createdAt = Between(new Date(startDate), new Date(endDate));
    } else if (startDate) {
      where.createdAt = Between(new Date(startDate), new Date());
    }

    const [data, total] = await this.activityLogRepo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return new PaginatedResponseDto(data, total, page, limit);
  }

  /**
   * Obtener un registro por ID
   */
  async findOne(id: string): Promise<ActivityLog | null> {
    return this.activityLogRepo.findOne({ where: { id } });
  }

  /**
   * Obtener actividades de una entidad específica
   */
  async findByEntity(
    entityType: string,
    entityId: string,
  ): Promise<ActivityLog[]> {
    return this.activityLogRepo.find({
      where: { entityType, entityId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  /**
   * Obtener estadísticas de actividad por usuario
   */
  async getStatsByUser(userId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const stats = await this.activityLogRepo
      .createQueryBuilder('log')
      .select('log.action', 'action')
      .addSelect('COUNT(*)', 'count')
      .where('log.userId = :userId', { userId })
      .andWhere('log.createdAt >= :startDate', { startDate })
      .groupBy('log.action')
      .getRawMany();

    return stats.map((stat) => ({
      action: stat.action,
      count: parseInt(stat.count, 10),
    }));
  }

  /**
   * Dashboard: últimas transacciones + conteos por acción + top usuarios del día
   */
  async getDashboard() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [recent, byAction, byUser, totalToday] = await Promise.all([
      // Últimas 20 transacciones
      this.activityLogRepo.find({
        order: { createdAt: 'DESC' },
        take: 20,
      }),
      // Conteo por acción (últimos 7 días)
      this.activityLogRepo
        .createQueryBuilder('log')
        .select('log.action', 'action')
        .addSelect('COUNT(*)', 'count')
        .where('log.created_at >= :since', {
          since: new Date(Date.now() - 7 * 86400 * 1000),
        })
        .groupBy('log.action')
        .getRawMany(),
      // Top 10 usuarios (hoy)
      this.activityLogRepo
        .createQueryBuilder('log')
        .select('log.userEmail', 'userEmail')
        .addSelect('log.userName', 'userName')
        .addSelect('COUNT(*)', 'count')
        .where('log.created_at >= :today', { today })
        .groupBy('log.userEmail, log.userName')
        .orderBy('count', 'DESC')
        .limit(10)
        .getRawMany(),
      // Total hoy
      this.activityLogRepo
        .createQueryBuilder('log')
        .where('log.created_at >= :today', { today })
        .getCount(),
    ]);

    return {
      recent,
      byAction: byAction.map((r) => ({
        action: r.action,
        count: parseInt(r.count, 10),
      })),
      byUser: byUser.map((r) => ({
        userEmail: r.userEmail,
        userName: r.userName,
        count: parseInt(r.count, 10),
      })),
      totalToday,
    };
  }

  /**
   * Últimas transacciones con filtro opcional de usuario
   */
  async getRecentTransactions(limit = 20, userEmail?: string) {
    const qb = this.activityLogRepo
      .createQueryBuilder('log')
      .orderBy('log.created_at', 'DESC')
      .take(limit);

    if (userEmail) {
      qb.where('log.userEmail = :userEmail', { userEmail });
    }

    return qb.getMany();
  }

  /**
   * Agrupado por usuario con conteo de transacciones (período configurable)
   */
  async getByUser(days = 30) {
    const since = new Date(Date.now() - days * 86400 * 1000);

    const rows = await this.activityLogRepo
      .createQueryBuilder('log')
      .select('log.userId', 'userId')
      .addSelect('log.userEmail', 'userEmail')
      .addSelect('log.userName', 'userName')
      .addSelect('COUNT(*)', 'total')
      .addSelect(
        `SUM(CASE WHEN log.action = 'CREATE' THEN 1 ELSE 0 END)`,
        'creates',
      )
      .addSelect(
        `SUM(CASE WHEN log.action = 'UPDATE' THEN 1 ELSE 0 END)`,
        'updates',
      )
      .addSelect(
        `SUM(CASE WHEN log.action = 'DELETE' THEN 1 ELSE 0 END)`,
        'deletes',
      )
      .addSelect('MAX(log.created_at)', 'lastActivity')
      .where('log.created_at >= :since', { since })
      .groupBy('log.userId, log.userEmail, log.userName')
      .orderBy('total', 'DESC')
      .getRawMany();

    return rows.map((r) => ({
      userId: r.userId,
      userEmail: r.userEmail,
      userName: r.userName,
      total: parseInt(r.total, 10),
      creates: parseInt(r.creates, 10),
      updates: parseInt(r.updates, 10),
      deletes: parseInt(r.deletes, 10),
      lastActivity: r.lastActivity,
    }));
  }

  /**
   * Limpiar logs antiguos
   */
  async cleanOldLogs(days: number = 90): Promise<number> {
    const date = new Date();
    date.setDate(date.getDate() - days);

    const result = await this.activityLogRepo
      .createQueryBuilder()
      .delete()
      .where('created_at < :date', { date })
      .execute();

    return result.affected || 0;
  }
}
