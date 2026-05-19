import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Routing } from './entities/routing.entity';
import { RoutingStep } from './entities/routing-step.entity';
import { CreateRoutingDto, CreateRoutingStepDto } from './dto/create-routing.dto';
import { UpdateRoutingDto, UpdateRoutingStepDto } from './dto/update-routing.dto';
import { FilterRoutingDto } from './dto/filter-routing.dto';

@Injectable()
export class RoutingsService {
  constructor(
    @InjectRepository(Routing)
    private readonly routingsRepo: Repository<Routing>,
    @InjectRepository(RoutingStep)
    private readonly stepsRepo: Repository<RoutingStep>,
  ) {}

  async create(dto: CreateRoutingDto): Promise<Routing> {
    const existing = await this.routingsRepo.findOne({
      where: { code: dto.code.toUpperCase() },
      withDeleted: true,
    });

    if (existing) {
      throw new ConflictException('Routing code already in use');
    }

    const routing = this.routingsRepo.create({
      code: dto.code.toUpperCase(),
      name: dto.name,
      productCode: dto.productCode.toUpperCase(),
      version: dto.version || '1.0',
      active: dto.active ?? true,
    });

    const saved = await this.routingsRepo.save(routing);

    if (dto.steps && dto.steps.length > 0) {
      const steps = dto.steps.map((step) =>
        this.stepsRepo.create({
          routingId: saved.id,
          seq: step.seq,
          operationCode: step.operationCode,
          operationName: step.operationName,
          workCenterCode: step.workCenterCode.toUpperCase(),
          setupMin: step.setupMin ?? 0,
          cycleMin: step.cycleMin ?? 0,
          qtyPerCycle: step.qtyPerCycle ?? 1,
          mandatory: step.mandatory ?? true,
          notes: step.notes || '',
        }),
      );
      await this.stepsRepo.save(steps);
    }

    return this.findOne(saved.id);
  }

  async findAll(filter: FilterRoutingDto) {
    const { page = 1, limit = 20, search, productCode, active } = filter;

    const where: any = {};

    if (typeof active === 'boolean') {
      where.active = active;
    }

    if (productCode) {
      where.productCode = productCode.toUpperCase();
    }

    if (search) {
      where.code = ILike(`%${search}%`);
    }

    const [data, total] = await this.routingsRepo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { fechaCreacion: 'DESC' },
      relations: ['steps'],
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Routing> {
    const routing = await this.routingsRepo.findOne({
      where: { id },
      relations: ['steps'],
    });

    if (!routing) {
      throw new NotFoundException(`Routing ${id} not found`);
    }

    return routing;
  }

  async update(id: string, dto: UpdateRoutingDto): Promise<Routing> {
    const routing = await this.findOne(id);

    if (dto.code && dto.code.toUpperCase() !== routing.code) {
      const exists = await this.routingsRepo.findOne({
        where: { code: dto.code.toUpperCase() },
      });

      if (exists) {
        throw new ConflictException('Routing code already in use');
      }
    }

    Object.assign(routing, {
      ...dto,
      code: dto.code ? dto.code.toUpperCase() : routing.code,
      productCode: dto.productCode ? dto.productCode.toUpperCase() : routing.productCode,
    });

    return this.routingsRepo.save(routing);
  }

  async remove(id: string): Promise<void> {
    const routing = await this.findOne(id);
    await this.routingsRepo.softDelete(routing.id);
  }

  async toggleActive(id: string, active: boolean): Promise<Routing> {
    const routing = await this.findOne(id);
    routing.active = active;
    return this.routingsRepo.save(routing);
  }

  // Steps CRUD
  async createStep(routingId: string, dto: CreateRoutingStepDto): Promise<RoutingStep> {
    const routing = await this.findOne(routingId);

    const step = this.stepsRepo.create({
      routingId: routing.id,
      seq: dto.seq,
      operationCode: dto.operationCode,
      operationName: dto.operationName,
      workCenterCode: dto.workCenterCode.toUpperCase(),
      setupMin: dto.setupMin ?? 0,
      cycleMin: dto.cycleMin ?? 0,
      qtyPerCycle: dto.qtyPerCycle ?? 1,
      mandatory: dto.mandatory ?? true,
      notes: dto.notes || '',
    });

    return this.stepsRepo.save(step);
  }

  async getSteps(routingId: string): Promise<RoutingStep[]> {
    await this.findOne(routingId);

    return this.stepsRepo.find({
      where: { routingId },
      order: { seq: 'ASC' },
    });
  }

  async updateStep(routingId: string, stepId: string, dto: UpdateRoutingStepDto): Promise<RoutingStep> {
    const step = await this.stepsRepo.findOne({ where: { id: stepId, routingId } });

    if (!step) {
      throw new NotFoundException(`Routing step ${stepId} not found`);
    }

    Object.assign(step, {
      ...dto,
      workCenterCode: dto.workCenterCode ? dto.workCenterCode.toUpperCase() : step.workCenterCode,
    });

    return this.stepsRepo.save(step);
  }

  async deleteStep(routingId: string, stepId: string): Promise<void> {
    const step = await this.stepsRepo.findOne({ where: { id: stepId, routingId } });

    if (!step) {
      throw new NotFoundException(`Routing step ${stepId} not found`);
    }

    await this.stepsRepo.remove(step);
  }
}
