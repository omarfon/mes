import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, ILike } from 'typeorm';

import { CreateMachineDto, MachineStatus } from '../dtos/create-machine.dto';
import { FilterMachinesDto } from '../dtos/filter-machine.dto';
import { UpdateMachineDto } from '../dtos/update-machine.dto';
import { Machine } from '../entities/machines.entity';

@Injectable()
export class MachinesService {
  private readonly logger = new Logger(MachinesService.name);

  private normalizeMachine(machine: Machine) {
    return {
      ...machine,
      description: machine.description ?? '',
      type: machine.type ?? '',
      model: machine.model ?? '',
      serialNumber: machine.serialNumber ?? '',
      area: machine.area ?? '',
      location: machine.location ?? '',
      nominalCapacity: machine.nominalCapacity ?? 0,
      workCenterId: machine.workCenterId ?? '',
    };
  }

  constructor(
    @InjectRepository(Machine)
    private readonly machineRepository: Repository<Machine>,
  ) { }

  async create(dto: CreateMachineDto) {
    // Validar unicidad del código (aunque la DB lo valida, es mejor hacerlo explícito)
    const existing = await this.machineRepository.findOne({
      where: { code: dto.code },
      withDeleted: true, // Chequear incluso si fue borrado soft
    });

    if (existing) {
      throw new BadRequestException(
        `Machine with code "${dto.code}" already exists`,
      );
    }

    const machine = this.machineRepository.create(dto);
    const saved = await this.machineRepository.save(machine);
    
    // Retornar la entidad guardada sin relaciones cargadas
    return this.normalizeMachine(saved);
  }

  async findAll(filter: FilterMachinesDto) {
    const { limit = 20, page = 1, search, status, workCenterId } = filter;
    const offset = (page - 1) * limit;

    const where: FindOptionsWhere<Machine> = {};

    if (status) {
      where.status = status as MachineStatus;
    }

    if (workCenterId) {
      where.workCenterId = workCenterId;
    }

    // Búsqueda básica por nombre, código o modelo
    const whereConditions: FindOptionsWhere<Machine>[] | FindOptionsWhere<Machine> = [];

    if (search) {
      const searchCondition = ILike(`%${search}%`);
      // Si hay otros filtros, combinamos con AND (search OR search OR search)
      // TypeORM hace OR entre elementos del array, y AND dentro del objeto
      // Así que necesitamos repetir las condiciones fijas para cada OR del search
      whereConditions.push(
        { ...where, code: searchCondition },
        { ...where, name: searchCondition },
        { ...where, model: searchCondition },
      );
    } else {
      // Si no hay search, usamos el where directo
      Object.assign(whereConditions, where);
    }

    // Nota: Si whereConditions es un array vacío (por asignación directa fallida), TypeORM trae todo.
    // Pero aquí si search es undefined, whereConditions será un objeto (el where original).
    // Si search está definido, será un array.

    // Corrección para asegurar que sea array o objeto correctamente para el find
    const finalWhere = Array.isArray(whereConditions) && whereConditions.length === 0
      ? where
      : whereConditions;

    const [data, total] = await this.machineRepository.findAndCount({
      where: finalWhere,
      take: limit,
      skip: offset,
      order: { fechaCreacion: 'DESC' },
      relations: ['workCenter'], // Cargar relación si es necesario mostrar info del centro
    });

    const normalizedData = data.map((machine) => this.normalizeMachine(machine));

    return {
      data: normalizedData,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const machine = await this.machineRepository.findOne({
      where: { id },
      relations: ['workCenter'],
    });

    if (!machine) {
      throw new NotFoundException(`Machine with id ${id} not found`);
    }

    return this.normalizeMachine(machine);
  }

  async update(id: string, dto: UpdateMachineDto) {
    const machine = await this.findOne(id); // Verifica existencia

    // Merge actualiza la entidad con los nuevos valores
    this.machineRepository.merge(machine, dto);

    try {
      const saved = await this.machineRepository.save(machine);
      return this.normalizeMachine(saved);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async updateStatus(id: string, status: MachineStatus | string) {
    const machine = await this.findOne(id);

    // Validación simple si viene como string
    if (!Object.values(MachineStatus).includes(status as MachineStatus)) {
      throw new BadRequestException(`Invalid status: ${status}`);
    }

    machine.status = status as MachineStatus;
    const saved = await this.machineRepository.save(machine);
    return this.normalizeMachine(saved);
  }

  async remove(id: string) {
    // Verificar que la máquina existe y NO está ya eliminada
    const machine = await this.machineRepository.findOne({
      where: { id },
    });

    if (!machine) {
      throw new NotFoundException(`Machine with id ${id} not found or already deleted`);
    }
    
    // Realizar soft delete
    const result = await this.machineRepository.softDelete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Machine with id ${id} could not be deleted`);
    }
    
    return {
      success: true,
      message: `Machine "${machine.name}" (${machine.code}) has been deleted successfully`,
      deletedMachine: {
        id: machine.id,
        code: machine.code,
        name: machine.name,
      },
    };
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
