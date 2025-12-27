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
