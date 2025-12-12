import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateWorkCenterDto } from './dto/create-work-center.dto';
import { FilterWorkCentersDto } from './dto/filter-work-center.dto';
import { UpdateWorkCenterDto } from './dto/update-work-center.dto';
import { WorkCenter, WorkCenterType } from './entities/work-center.entity';


@Injectable()
export class WorkCentersService {
  constructor(
    @InjectRepository(WorkCenter)
    private readonly workCentersRepo: Repository<WorkCenter>,
  ) {}

  async create(dto: CreateWorkCenterDto): Promise<WorkCenter> {
    const existing = await this.workCentersRepo.findOne({
      where: { code: dto.code.toUpperCase() },
      withDeleted: true,
    });

    if (existing) {
      throw new ConflictException('Work center code already in use');
    }

    const workCenter = this.workCentersRepo.create({
      code: dto.code.toUpperCase(),
      name: dto.name,
      description: dto.description,
      type: dto.type ?? WorkCenterType.LINE,
      area: dto.area,
      location: dto.location,
      nominalCapacity: dto.nominalCapacity,
      isActive: dto.isActive ?? true,
    });

    return this.workCentersRepo.save(workCenter);
  }

  async findAll(filter: FilterWorkCentersDto) {
    const { page = 1, limit = 20, search, isActive } = filter;

    const where: any = {};

    if (typeof isActive === 'boolean') {
      where.isActive = isActive;
    }

    if (search) {
      where.code = ILike(`%${search}%`);
      // si quieres algo más pro, luego hacemos QueryBuilder con OR a nombre/area
    }

    const [data, total] = await this.workCentersRepo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['machines'],
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<WorkCenter> {
    const wc = await this.workCentersRepo.findOne({
      where: { id },
      relations: ['machines'],
    });

    if (!wc) {
      throw new NotFoundException(`Work center ${id} not found`);
    }

    return wc;
  }

  async update(id: string, dto: UpdateWorkCenterDto): Promise<WorkCenter> {
    const wc = await this.findOne(id);

    if (dto.code && dto.code.toUpperCase() !== wc.code) {
      const exists = await this.workCentersRepo.findOne({
        where: { code: dto.code.toUpperCase() },
      });
      if (exists) {
        throw new ConflictException('Work center code already in use');
      }
    }

    wc.code = dto.code ? dto.code.toUpperCase() : wc.code;
    wc.name = dto.name ?? wc.name;
    wc.description = dto.description ?? wc.description;
    wc.type = dto.type ?? wc.type;
    wc.area = dto.area ?? wc.area;
    wc.location = dto.location ?? wc.location;
    wc.nominalCapacity =
      dto.nominalCapacity !== undefined
        ? dto.nominalCapacity
        : wc.nominalCapacity;

    if (dto.isActive !== undefined) {
      wc.isActive = dto.isActive;
    }

    return this.workCentersRepo.save(wc);
  }

  async toggleActive(id: string, isActive: boolean): Promise<WorkCenter> {
    const wc = await this.findOne(id);
    wc.isActive = isActive;
    return this.workCentersRepo.save(wc);
  }

  async softDelete(id: string): Promise<void> {
    await this.workCentersRepo.softDelete(id);
  }
}
