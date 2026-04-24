import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Workstation } from './entities/workstation.entity';
import { CreateWorkstationDto } from './dto/create-workstation.dto';
import { UpdateWorkstationDto } from './dto/update-workstation.dto';
import { FilterWorkstationDto } from './dto/filter-workstation.dto';

@Injectable()
export class WorkstationsService {
  constructor(
    @InjectRepository(Workstation)
    private readonly workstationsRepo: Repository<Workstation>,
  ) {}

  async create(dto: CreateWorkstationDto): Promise<Workstation> {
    const existing = await this.workstationsRepo.findOne({
      where: { code: dto.code.toUpperCase() },
      withDeleted: true,
    });

    if (existing) {
      throw new ConflictException('Workstation code already in use');
    }

    const workstation = this.workstationsRepo.create({
      code: dto.code.toUpperCase(),
      name: dto.name,
      workCenterCode: dto.workCenterCode?.toUpperCase() || '',
      type: dto.type,
      asset: dto.asset || '',
      operatorSlots: dto.operatorSlots ?? 1,
      active: dto.active ?? true,
    });

    return this.workstationsRepo.save(workstation);
  }

  async findAll(filter: FilterWorkstationDto) {
    const { page = 1, limit = 20, search, workCenterCode, type, active } = filter;

    const where: any = {};

    if (typeof active === 'boolean') {
      where.active = active;
    }

    if (workCenterCode) {
      where.workCenterCode = workCenterCode.toUpperCase();
    }

    if (type) {
      where.type = type;
    }

    if (search) {
      where.code = ILike(`%${search}%`);
    }

    const [data, total] = await this.workstationsRepo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Workstation> {
    const workstation = await this.workstationsRepo.findOne({ where: { id } });

    if (!workstation) {
      throw new NotFoundException(`Workstation ${id} not found`);
    }

    return workstation;
  }

  async update(id: string, dto: UpdateWorkstationDto): Promise<Workstation> {
    const workstation = await this.findOne(id);

    if (dto.code && dto.code.toUpperCase() !== workstation.code) {
      const exists = await this.workstationsRepo.findOne({
        where: { code: dto.code.toUpperCase() },
      });

      if (exists) {
        throw new ConflictException('Workstation code already in use');
      }
    }

    Object.assign(workstation, {
      ...dto,
      code: dto.code ? dto.code.toUpperCase() : workstation.code,
      workCenterCode: dto.workCenterCode ? dto.workCenterCode.toUpperCase() : workstation.workCenterCode,
    });

    return this.workstationsRepo.save(workstation);
  }

  async remove(id: string): Promise<void> {
    const workstation = await this.findOne(id);
    await this.workstationsRepo.softDelete(workstation.id);
  }

  async toggleActive(id: string, active: boolean): Promise<Workstation> {
    const workstation = await this.findOne(id);
    workstation.active = active;
    return this.workstationsRepo.save(workstation);
  }
}
