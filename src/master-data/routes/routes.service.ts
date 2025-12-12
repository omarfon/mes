import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateRouteDto } from './dto/create-route.dto';
import { FilterRoutesDto } from './dto/filter-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { RouteOperation } from './entities/route-operation.entity';
import { Route } from './entities/route.entity';


@Injectable()
export class RoutesService {
  constructor(
    @InjectRepository(Route)
    private readonly routesRepo: Repository<Route>,
    @InjectRepository(RouteOperation)
    private readonly operationsRepo: Repository<RouteOperation>,
  ) {}

  async create(dto: CreateRouteDto): Promise<Route> {
    const existing = await this.routesRepo.findOne({
      where: { code: dto.code.toUpperCase() },
      withDeleted: true,
    });

    if (existing) {
      throw new ConflictException('Route code already in use');
    }

    const route = this.routesRepo.create({
      code: dto.code.toUpperCase(),
      name: dto.name,
      description: dto.description,
      productId: dto.productId,
      version: dto.version ?? 1,
      effectiveFrom: dto.effectiveFrom
        ? new Date(dto.effectiveFrom)
        : null,
      effectiveTo: dto.effectiveTo ? new Date(dto.effectiveTo) : null,
      isActive: true,
      operations: dto.operations.map((op) =>
        this.operationsRepo.create({
          sequence: op.sequence,
          name: op.name,
          workCenterId: op.workCenterId,
          machineId: op.machineId,
          standardTimeMinutes: op.standardTimeMinutes,
          overlapAllowed: op.overlapAllowed ?? false,
          notes: op.notes,
        }),
      ),
    });

    return this.routesRepo.save(route);
  }

  async findAll(filter: FilterRoutesDto) {
    const {
      productId,
      search,
      isActive,
      page = 1,
      limit = 20,
    } = filter;

    const where: any = {};

    if (productId) {
      where.productId = productId;
    }

    if (typeof isActive === 'boolean') {
      where.isActive = isActive;
    }

    if (search) {
      where.code = ILike(`%${search}%`);
      // Podrías extender para nombre con QueryBuilder
    }

    const [data, total] = await this.routesRepo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      // operations ya vienen por eager: true en la entity
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Route> {
    const route = await this.routesRepo.findOne({
      where: { id },
    });

    if (!route) {
      throw new NotFoundException(`Route ${id} not found`);
    }

    return route;
  }

  async update(id: string, dto: UpdateRouteDto): Promise<Route> {
    const route = await this.findOne(id);

    if (dto.code && dto.code.toUpperCase() !== route.code) {
      const exists = await this.routesRepo.findOne({
        where: { code: dto.code.toUpperCase() },
      });
      if (exists) {
        throw new ConflictException('Route code already in use');
      }
    }

    route.code = dto.code ? dto.code.toUpperCase() : route.code;
    route.name = dto.name ?? route.name;
    route.description = dto.description ?? route.description;
    route.productId = dto.productId ?? route.productId;
    route.version = dto.version ?? route.version;
    route.effectiveFrom = dto.effectiveFrom
      ? new Date(dto.effectiveFrom)
      : route.effectiveFrom;
    route.effectiveTo = dto.effectiveTo
      ? new Date(dto.effectiveTo)
      : route.effectiveTo;

    // Si envías operations en el update, aquí las reemplazamos completamente
    if (dto.operations) {
      // borrar operaciones actuales
      await this.operationsRepo.delete({ routeId: route.id });

      route.operations = dto.operations.map((op) =>
        this.operationsRepo.create({
          routeId: route.id,
          sequence: op.sequence,
          name: op.name,
          workCenterId: op.workCenterId,
          machineId: op.machineId,
          standardTimeMinutes: op.standardTimeMinutes,
          overlapAllowed: op.overlapAllowed ?? false,
          notes: op.notes,
        }),
      );
    }

    return this.routesRepo.save(route);
  }

  async toggleActive(id: string, isActive: boolean): Promise<Route> {
    const route = await this.findOne(id);
    route.isActive = isActive;
    return this.routesRepo.save(route);
  }

  async softDelete(id: string): Promise<void> {
    await this.routesRepo.softDelete(id);
  }
}
