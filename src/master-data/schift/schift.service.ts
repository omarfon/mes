import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateShiftDto } from './dto/create-schift.dto';
import { FilterShiftsDto } from './dto/filter-schift.dto';
import { UpdateShiftDto } from './dto/update-schift.dto';
import { Shift } from './entities/schift.entity';


@Injectable()
export class ShiftsService {
  constructor(
    @InjectRepository(Shift)
    private readonly shiftsRepo: Repository<Shift>,
  ) {}

  async create(dto: CreateShiftDto): Promise<Shift> {
    const existing = await this.shiftsRepo.findOne({
      where: { code: dto.code.toUpperCase() },
      withDeleted: true,
    });

    if (existing) {
      throw new ConflictException('Shift code already in use');
    }

    const shift = this.shiftsRepo.create({
      code: dto.code.toUpperCase(),
      name: dto.name,
      description: dto.description,
      startTime: `${dto.startTime}:00`, // convertir HH:mm -> HH:mm:00
      endTime: `${dto.endTime}:00`,
      crossesMidnight: dto.crossesMidnight ?? false,
      breakMinutes: dto.breakMinutes ?? 0,
      isActive: true,
    });

    return this.shiftsRepo.save(shift);
  }

  async findAll(filter: FilterShiftsDto) {
    const { page = 1, limit = 20, search, isActive } = filter;

    const where: any = {};

    if (typeof isActive === 'boolean') {
      where.isActive = isActive;
    }

    if (search) {
      where.code = ILike(`%${search}%`);
      // si quieres buscar por nombre también, luego armamos un OR con QueryBuilder
    }

    const [data, total] = await this.shiftsRepo.findAndCount({
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

  async findOne(id: string): Promise<Shift> {
    const shift = await this.shiftsRepo.findOne({ where: { id } });

    if (!shift) {
      throw new NotFoundException(`Shift ${id} not found`);
    }

    return shift;
  }

  async update(id: string, dto: UpdateShiftDto): Promise<Shift> {
    const shift = await this.findOne(id);

    if (dto.code && dto.code.toUpperCase() !== shift.code) {
      const exists = await this.shiftsRepo.findOne({
        where: { code: dto.code.toUpperCase() },
      });
      if (exists) {
        throw new ConflictException('Shift code already in use');
      }
    }

    shift.code = dto.code ? dto.code.toUpperCase() : shift.code;
    shift.name = dto.name ?? shift.name;
    shift.description = dto.description ?? shift.description;

    if (dto.startTime) {
      shift.startTime = `${dto.startTime}:00`;
    }
    if (dto.endTime) {
      shift.endTime = `${dto.endTime}:00`;
    }

    if (dto.crossesMidnight !== undefined) {
      shift.crossesMidnight = dto.crossesMidnight;
    }

    if (dto.breakMinutes !== undefined) {
      shift.breakMinutes = dto.breakMinutes;
    }

    return this.shiftsRepo.save(shift);
  }

  async toggleActive(id: string, isActive: boolean): Promise<Shift> {
    const shift = await this.findOne(id);
    shift.isActive = isActive;
    return this.shiftsRepo.save(shift);
  }

  async softDelete(id: string): Promise<void> {
    await this.shiftsRepo.softDelete(id);
  }
}
