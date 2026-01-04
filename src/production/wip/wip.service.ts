import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WIP } from './entities/wip.entity';
import { CreateWIPDto } from './dto/create-wip.dto';
import { UpdateWIPDto } from './dto/update-wip.dto';
import { FilterWIPDto } from './dto/filter-wip.dto';

@Injectable()
export class WIPService {
  constructor(
    @InjectRepository(WIP)
    private readonly wipRepo: Repository<WIP>,
  ) {}

  async create(dto: CreateWIPDto): Promise<WIP> {
    const wip = this.wipRepo.create(dto);
    return this.wipRepo.save(wip);
  }

  async findAll(filter: FilterWIPDto) {
    const {
      page = 1,
      limit = 20,
      search,
      ordenId,
      productoId,
      workCenterId,
      lote,
    } = filter;

    const queryBuilder = this.wipRepo.createQueryBuilder('wip');

    if (search) {
      queryBuilder.andWhere(
        '(wip.productoNombre ILIKE :search OR wip.lote ILIKE :search OR wip.ubicacion ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (ordenId) {
      queryBuilder.andWhere('wip.ordenId = :ordenId', { ordenId });
    }

    if (productoId) {
      queryBuilder.andWhere('wip.productoId = :productoId', { productoId });
    }

    if (workCenterId) {
      queryBuilder.andWhere('wip.workCenterId = :workCenterId', { workCenterId });
    }

    if (lote) {
      queryBuilder.andWhere('wip.lote = :lote', { lote });
    }

    const [data, total] = await queryBuilder
      .take(limit)
      .skip((page - 1) * limit)
      .orderBy('wip.fechaEntrada', 'DESC')
      .getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<WIP> {
    const wip = await this.wipRepo.findOne({ where: { id } });

    if (!wip) {
      throw new NotFoundException(`WIP con id ${id} no encontrado`);
    }

    return wip;
  }

  async findByOrden(ordenId: string): Promise<WIP[]> {
    return this.wipRepo.find({
      where: { ordenId },
      order: { fechaEntrada: 'DESC' },
    });
  }

  async findByWorkCenter(workCenterId: string): Promise<WIP[]> {
    return this.wipRepo.find({
      where: { workCenterId },
      order: { fechaEntrada: 'DESC' },
    });
  }

  async update(id: string, dto: UpdateWIPDto): Promise<WIP> {
    const wip = await this.findOne(id);
    
    Object.assign(wip, dto);
    wip.fechaActualizacion = new Date();

    // Registrar movimiento
    if (dto.cantidadActual !== undefined || dto.ubicacion || dto.workCenterId) {
      const movimientos = wip.movimientos || [];
      movimientos.push({
        fecha: new Date(),
        cantidadAnterior: wip.cantidadActual,
        cantidadNueva: dto.cantidadActual,
        ubicacionAnterior: wip.ubicacion,
        ubicacionNueva: dto.ubicacion,
        workCenterAnterior: wip.workCenterId,
        workCenterNuevo: dto.workCenterId,
      });
      wip.movimientos = movimientos;
    }

    return this.wipRepo.save(wip);
  }

  async ajustarCantidad(id: string, cantidad: number, motivo?: string): Promise<WIP> {
    const wip = await this.findOne(id);
    
    const cantidadAnterior = wip.cantidadActual;
    wip.cantidadActual = cantidad;
    wip.fechaActualizacion = new Date();

    const movimientos = wip.movimientos || [];
    movimientos.push({
      fecha: new Date(),
      tipo: 'AJUSTE',
      cantidadAnterior,
      cantidadNueva: cantidad,
      diferencia: cantidad - cantidadAnterior,
      motivo,
    });
    wip.movimientos = movimientos;

    return this.wipRepo.save(wip);
  }

  async transferir(id: string, nuevoWorkCenterId: string, nuevaUbicacion?: string): Promise<WIP> {
    const wip = await this.findOne(id);
    
    const workCenterAnterior = wip.workCenterId;
    const ubicacionAnterior = wip.ubicacion;

    wip.workCenterId = nuevoWorkCenterId;
    if (nuevaUbicacion) {
      wip.ubicacion = nuevaUbicacion;
    }
    wip.fechaActualizacion = new Date();

    const movimientos = wip.movimientos || [];
    movimientos.push({
      fecha: new Date(),
      tipo: 'TRANSFERENCIA',
      workCenterAnterior,
      workCenterNuevo: nuevoWorkCenterId,
      ubicacionAnterior,
      ubicacionNueva: nuevaUbicacion,
    });
    wip.movimientos = movimientos;

    return this.wipRepo.save(wip);
  }

  async remove(id: string) {
    const wip = await this.findOne(id);
    await this.wipRepo.remove(wip);
    
    return {
      success: true,
      message: 'WIP eliminado exitosamente',
    };
  }

  async getResumen() {
    const resumen = await this.wipRepo
      .createQueryBuilder('wip')
      .select('wip.workCenterId', 'workCenterId')
      .addSelect('wip.workCenterNombre', 'workCenterNombre')
      .addSelect('COUNT(*)', 'cantidadItems')
      .addSelect('SUM(wip.cantidadActual)', 'cantidadTotal')
      .groupBy('wip.workCenterId')
      .addGroupBy('wip.workCenterNombre')
      .getRawMany();

    return resumen;
  }
}