import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StandardTime } from './entities/standard-time.entity';
import { CreateStandardTimeDto } from './dto/create-standard-time.dto';
import { UpdateStandardTimeDto } from './dto/update-standard-time.dto';
import { FilterStandardTimeDto } from './dto/filter-standard-time.dto';

@Injectable()
export class StandardTimesService {
  constructor(
    @InjectRepository(StandardTime)
    private readonly standardTimesRepo: Repository<StandardTime>,
  ) {}

  async create(dto: CreateStandardTimeDto): Promise<StandardTime> {
    const standardTime = this.standardTimesRepo.create({
      operationCode: dto.operationCode,
      operationName: dto.operationName,
      productCode: dto.productCode.toUpperCase(),
      workCenterCode: dto.workCenterCode.toUpperCase(),
      setupMin: dto.setupMin ?? 0,
      cycleMin: dto.cycleMin ?? 0,
      timePerUnitMin: dto.timePerUnitMin ?? 0,
      batchSize: dto.batchSize ?? 1,
      efficiencyPct: dto.efficiencyPct ?? 100,
      validFrom: dto.validFrom || '',
      active: dto.active ?? true,
      notes: dto.notes || '',
    });

    return this.standardTimesRepo.save(standardTime);
  }

  async findAll(filter: FilterStandardTimeDto) {
    const { page = 1, limit = 20, productCode, workCenterCode, active } = filter;

    const where: any = {};

    if (typeof active === 'boolean') {
      where.active = active;
    }

    if (productCode) {
      where.productCode = productCode.toUpperCase();
    }

    if (workCenterCode) {
      where.workCenterCode = workCenterCode.toUpperCase();
    }

    const [data, total] = await this.standardTimesRepo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { fechaCreacion: 'DESC' },
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<StandardTime> {
    const standardTime = await this.standardTimesRepo.findOne({ where: { id } });

    if (!standardTime) {
      throw new NotFoundException(`Standard time ${id} not found`);
    }

    return standardTime;
  }

  async update(id: string, dto: UpdateStandardTimeDto): Promise<StandardTime> {
    const standardTime = await this.findOne(id);

    Object.assign(standardTime, {
      ...dto,
      productCode: dto.productCode ? dto.productCode.toUpperCase() : standardTime.productCode,
      workCenterCode: dto.workCenterCode ? dto.workCenterCode.toUpperCase() : standardTime.workCenterCode,
    });

    return this.standardTimesRepo.save(standardTime);
  }

  async remove(id: string): Promise<void> {
    const standardTime = await this.findOne(id);
    await this.standardTimesRepo.softDelete(standardTime.id);
  }

  async toggleActive(id: string, active: boolean): Promise<StandardTime> {
    const standardTime = await this.findOne(id);
    standardTime.active = active;
    return this.standardTimesRepo.save(standardTime);
  }
}
