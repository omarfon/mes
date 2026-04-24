import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlantCalendar } from './entities/plant-calendar.entity';
import { CreatePlantCalendarDto } from './dto/create-plant-calendar.dto';
import { UpdatePlantCalendarDto } from './dto/update-plant-calendar.dto';
import { FilterPlantCalendarDto } from './dto/filter-plant-calendar.dto';

@Injectable()
export class PlantCalendarService {
  constructor(
    @InjectRepository(PlantCalendar)
    private readonly calendarRepo: Repository<PlantCalendar>,
  ) {}

  async create(dto: CreatePlantCalendarDto): Promise<PlantCalendar> {
    const calendar = this.calendarRepo.create({
      ...dto,
      plantCode: dto.plantCode.toUpperCase(),
      notes: dto.notes || '',
    });

    return this.calendarRepo.save(calendar);
  }

  async findAll(filter: FilterPlantCalendarDto) {
    const { page = 1, limit = 20, plantCode, type } = filter;

    const where: any = {};

    if (plantCode) {
      where.plantCode = plantCode.toUpperCase();
    }

    if (type) {
      where.type = type;
    }

    const [data, total] = await this.calendarRepo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { date: 'ASC' },
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<PlantCalendar> {
    const calendar = await this.calendarRepo.findOne({ where: { id } });

    if (!calendar) {
      throw new NotFoundException(`Plant calendar ${id} not found`);
    }

    return calendar;
  }

  async update(id: string, dto: UpdatePlantCalendarDto): Promise<PlantCalendar> {
    const calendar = await this.findOne(id);

    Object.assign(calendar, {
      ...dto,
      plantCode: dto.plantCode ? dto.plantCode.toUpperCase() : calendar.plantCode,
    });

    return this.calendarRepo.save(calendar);
  }

  async remove(id: string): Promise<void> {
    const calendar = await this.findOne(id);
    await this.calendarRepo.softDelete(calendar.id);
  }
}
