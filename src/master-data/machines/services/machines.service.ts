import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMachineDto, MachineStatus } from '../dtos/create-machine.dto';
import { FilterMachinesDto } from '../dtos/filter-machine.dto';
import { UpdateMachineDto } from '../dtos/update-machine.dto';



@Injectable()
export class MachinesService {
  async create(dto: CreateMachineDto) {
    // TODO: usar repositorio (TypeORM/Prisma)
    return { id: 'mock-id', ...dto };
  }

  async findAll(filter: FilterMachinesDto) {
    // TODO: aplicar filtros y paginación
    return {
      data: [],
      total: 0,
      page: filter.page ?? 1,
      limit: filter.limit ?? 20,
    };
  }

  async findOne(id: string) {
    // TODO: buscar en DB
    const machine = null;
    if (!machine) {
      throw new NotFoundException(`Machine ${id} not found`);
    }
    return machine;
  }

  async update(id: string, dto: UpdateMachineDto) {
    // TODO: actualizar en DB
    return { id, ...dto };
  }

  async updateStatus(id: string, status: MachineStatus | string) {
    // TODO: validar enum y actualizar solo el estado
    return { id, status };
  }

  async remove(id: string): Promise<void> {
    // TODO: soft-delete o hard-delete
    return;
  }
}
