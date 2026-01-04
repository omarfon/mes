import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { TraceabilityEvent, EventType } from './entities/traceability-event.entity';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(TraceabilityEvent)
    private eventRepository: Repository<TraceabilityEvent>,
  ) {}

  async create(userId: string, createDto: CreateEventDto): Promise<TraceabilityEvent> {
    const event = this.eventRepository.create({
      ...createDto,
      userId,
    });
    return this.eventRepository.save(event);
  }

  async findAll(filters?: {
    entityType?: string;
    entityId?: string;
    eventType?: EventType;
    userId?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<TraceabilityEvent[]> {
    const query = this.eventRepository.createQueryBuilder('event');

    if (filters?.entityType) {
      query.andWhere('event.entityType = :entityType', { entityType: filters.entityType });
    }

    if (filters?.entityId) {
      query.andWhere('event.entityId = :entityId', { entityId: filters.entityId });
    }

    if (filters?.eventType) {
      query.andWhere('event.eventType = :eventType', { eventType: filters.eventType });
    }

    if (filters?.userId) {
      query.andWhere('event.userId = :userId', { userId: filters.userId });
    }

    if (filters?.startDate && filters?.endDate) {
      query.andWhere('event.timestamp BETWEEN :startDate AND :endDate', {
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
    }

    return query.orderBy('event.timestamp', 'DESC').getMany();
  }

  async findByEntity(entityType: string, entityId: string): Promise<TraceabilityEvent[]> {
    return this.eventRepository.find({
      where: { entityType, entityId },
      order: { timestamp: 'DESC' },
    });
  }

  async getEventStats(entityType?: string): Promise<any> {
    const query = this.eventRepository
      .createQueryBuilder('event')
      .select('event.eventType', 'eventType')
      .addSelect('COUNT(*)', 'count')
      .groupBy('event.eventType');

    if (entityType) {
      query.where('event.entityType = :entityType', { entityType });
    }

    return query.getRawMany();
  }
}
