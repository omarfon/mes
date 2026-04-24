import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { ShiftGroup } from './entities/shift-group.entity';
import { CreateShiftGroupDto } from './dto/create-shift-group.dto';
import { UpdateShiftGroupDto } from './dto/update-shift-group.dto';
import { FilterShiftGroupDto } from './dto/filter-shift-group.dto';

@Injectable()
export class ShiftGroupsService {
  constructor(
    @InjectRepository(ShiftGroup)
    private readonly shiftGroupsRepo: Repository<ShiftGroup>,
  ) {}

  async create(dto: CreateShiftGroupDto): Promise<ShiftGroup> {
    const existing = await this.shiftGroupsRepo.findOne({
      where: { code: dto.code.toUpperCase() },
      withDeleted: true,
    });

    if (existing) {
      throw new ConflictException('Shift group code already in use');
    }

    const shiftGroup = this.shiftGroupsRepo.create({
      code: dto.code.toUpperCase(),
      name: dto.name,
      plantCode: dto.plantCode.toUpperCase(),
      shiftCodes: dto.shiftCodes || '',
      supervisorCode: dto.supervisorCode || '',
      headcount: dto.headcount ?? 0,
      notes: dto.notes || '',
      active: dto.active ?? true,
    });

    return this.shiftGroupsRepo.save(shiftGroup);
  }

  async findAll(filter: FilterShiftGroupDto) {
    const { page = 1, limit = 20, search, plantCode, active } = filter;

    const where: any = {};

    if (typeof active === 'boolean') {
      where.active = active;
    }

    if (plantCode) {
      where.plantCode = plantCode.toUpperCase();
    }

    if (search) {
      where.code = ILike(`%${search}%`);
    }

    const [data, total] = await this.shiftGroupsRepo.findAndCount({
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

  async findOne(id: string): Promise<ShiftGroup> {
    const shiftGroup = await this.shiftGroupsRepo.findOne({ where: { id } });

    if (!shiftGroup) {
      throw new NotFoundException(`Shift group ${id} not found`);
    }

    return shiftGroup;
  }

  async update(id: string, dto: UpdateShiftGroupDto): Promise<ShiftGroup> {
    const shiftGroup = await this.findOne(id);

    if (dto.code && dto.code.toUpperCase() !== shiftGroup.code) {
      const exists = await this.shiftGroupsRepo.findOne({
        where: { code: dto.code.toUpperCase() },
      });

      if (exists) {
        throw new ConflictException('Shift group code already in use');
      }
    }

    Object.assign(shiftGroup, {
      ...dto,
      code: dto.code ? dto.code.toUpperCase() : shiftGroup.code,
      plantCode: dto.plantCode ? dto.plantCode.toUpperCase() : shiftGroup.plantCode,
    });

    return this.shiftGroupsRepo.save(shiftGroup);
  }

  async remove(id: string): Promise<void> {
    const shiftGroup = await this.findOne(id);
    await this.shiftGroupsRepo.softDelete(shiftGroup.id);
  }

  async toggleActive(id: string, active: boolean): Promise<ShiftGroup> {
    const shiftGroup = await this.findOne(id);
    shiftGroup.active = active;
    return this.shiftGroupsRepo.save(shiftGroup);
  }
}
