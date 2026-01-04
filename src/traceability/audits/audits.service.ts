import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere } from 'typeorm';
import { Audit } from './entities/audit.entity';
import { CreateAuditDto } from './dto/create-audit.dto';
import { FilterAuditDto } from './dto/filter-audit.dto';

@Injectable()
export class AuditsService {
  constructor(
    @InjectRepository(Audit)
    private readonly auditRepository: Repository<Audit>,
  ) {}

  async create(createAuditDto: CreateAuditDto): Promise<Audit> {
    const audit = this.auditRepository.create(createAuditDto);
    return this.auditRepository.save(audit);
  }

  async findAll(filterDto: FilterAuditDto) {
    const { page = 1, limit = 20, startDate, endDate, ...filters } = filterDto;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Audit> = {};

    if (filters.action) {
      where.action = filters.action;
    }

    if (filters.entityType) {
      where.entityType = filters.entityType;
    }

    if (filters.entityId) {
      where.entityId = filters.entityId;
    }

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.module) {
      where.module = filters.module;
    }

    if (startDate && endDate) {
      where.createdAt = Between(new Date(startDate), new Date(endDate));
    } else if (startDate) {
      where.createdAt = Between(new Date(startDate), new Date());
    }

    const [data, total] = await this.auditRepository.findAndCount({
      where,
      relations: ['user'],
      order: { createdAt: 'DESC' },
      take: limit,
      skip,
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Audit> {
    const audit = await this.auditRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!audit) {
      throw new NotFoundException(`Auditoría con ID ${id} no encontrada`);
    }

    return audit;
  }

  async findByEntity(entityType: string, entityId: string): Promise<Audit[]> {
    return this.auditRepository.find({
      where: { entityType, entityId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: string, limit: number = 50): Promise<Audit[]> {
    return this.auditRepository.find({
      where: { userId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getStatsByAction() {
    const stats = await this.auditRepository
      .createQueryBuilder('audit')
      .select('audit.action', 'action')
      .addSelect('COUNT(*)', 'count')
      .groupBy('audit.action')
      .getRawMany();

    return stats;
  }

  async getStatsByEntityType() {
    const stats = await this.auditRepository
      .createQueryBuilder('audit')
      .select('audit.entityType', 'entityType')
      .addSelect('COUNT(*)', 'count')
      .groupBy('audit.entityType')
      .orderBy('count', 'DESC')
      .getRawMany();

    return stats;
  }

  async getActivityTimeline(days: number = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const timeline = await this.auditRepository
      .createQueryBuilder('audit')
      .select('DATE(audit.createdAt)', 'date')
      .addSelect('COUNT(*)', 'count')
      .where('audit.createdAt >= :startDate', { startDate })
      .groupBy('DATE(audit.createdAt)')
      .orderBy('DATE(audit.createdAt)', 'ASC')
      .getRawMany();

    return timeline;
  }

  async getUserActivity(userId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const activity = await this.auditRepository.find({
      where: {
        userId,
        createdAt: Between(startDate, new Date()),
      },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });

    const stats = await this.auditRepository
      .createQueryBuilder('audit')
      .select('audit.action', 'action')
      .addSelect('COUNT(*)', 'count')
      .where('audit.userId = :userId', { userId })
      .andWhere('audit.createdAt >= :startDate', { startDate })
      .groupBy('audit.action')
      .getRawMany();

    return {
      recentActivity: activity,
      actionStats: stats,
    };
  }
}
