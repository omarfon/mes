// ejecucion.service.ts - ACTUALIZADO
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ejecucion, EstadoEjecucion } from './entities/ejecucion.entity';
import { CreateEjecucionDto } from './dto/create-ejecucion.dto';
import { UpdateEjecucionDto } from './dto/update-ejecucion.dto';
import { FilterEjecucionDto } from './dto/filter-ejecucion.dto';

@Injectable()
export class EjecucionService {
  constructor(
    @InjectRepository(Ejecucion)
    private readonly ejecucionRepo: Repository<Ejecucion>,
  ) {}

  async create(dto: CreateEjecucionDto): Promise<Ejecucion> {
    const ejecucion = this.ejecucionRepo.create({
      ...dto,
      fechaInicio: dto.fechaInicio ? new Date(dto.fechaInicio) : new Date(),
      cantidadEjecutada: 0,
      cantidadRechazada: 0,
    });
    return this.ejecucionRepo.save(ejecucion);
  }

  async findAll(filter: FilterEjecucionDto) {
    const {
      page = 1,
      limit = 20,
      estado,
      ordenId,
      maquinaId,
      operadorId,
      fechaDesde,
      fechaHasta,
    } = filter;

    const queryBuilder = this.ejecucionRepo
      .createQueryBuilder('ejecucion')
      .leftJoinAndSelect('ejecucion.maquina', 'maquina')
      .leftJoinAndSelect('ejecucion.operador', 'operador');

    if (estado) {
      queryBuilder.andWhere('ejecucion.estado = :estado', { estado });
    }

    if (ordenId) {
      queryBuilder.andWhere('ejecucion.ordenId = :ordenId', { ordenId });
    }

    if (maquinaId) {
      queryBuilder.andWhere('ejecucion.maquinaId = :maquinaId', { maquinaId });
    }

    if (operadorId) {
      queryBuilder.andWhere('ejecucion.operadorId = :operadorId', { operadorId });
    }

    if (fechaDesde && fechaHasta) {
      queryBuilder.andWhere('ejecucion.fechaInicio BETWEEN :fechaDesde AND :fechaHasta', {
        fechaDesde,
        fechaHasta,
      });
    }

    const [data, total] = await queryBuilder
      .take(limit)
      .skip((page - 1) * limit)
      .orderBy('ejecucion.fechaInicio', 'DESC')
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

  async findOne(id: string): Promise<Ejecucion> {
    const ejecucion = await this.ejecucionRepo.findOne({ 
      where: { id },
      relations: ['maquina', 'operador']
    });

    if (!ejecucion) {
      throw new NotFoundException(`Ejecución con id ${id} no encontrada`);
    }

    return ejecucion;
  }

  async findByOrden(ordenId: string): Promise<Ejecucion[]> {
    return this.ejecucionRepo.find({
      where: { ordenId },
      order: { fechaInicio: 'DESC' },
      relations: ['maquina', 'operador']
    });
  }

  async update(id: string, dto: UpdateEjecucionDto): Promise<Ejecucion> {
    const ejecucion = await this.findOne(id);
    Object.assign(ejecucion, dto);
    return this.ejecucionRepo.save(ejecucion);
  }

  async cambiarEstado(id: string, nuevoEstado: EstadoEjecucion): Promise<Ejecucion> {
    const ejecucion = await this.findOne(id);
    ejecucion.estado = nuevoEstado;

    if (nuevoEstado === EstadoEjecucion.COMPLETADA && !ejecucion.fechaFin) {
      ejecucion.fechaFin = new Date();
    }

    return this.ejecucionRepo.save(ejecucion);
  }

  async registrarProduccion(id: string, cantidad: number): Promise<Ejecucion> {
    const ejecucion = await this.findOne(id);
    
    if (ejecucion.estado === EstadoEjecucion.COMPLETADA) {
      throw new BadRequestException('No se puede registrar producción en una ejecución completada');
    }

    ejecucion.cantidadEjecutada += cantidad;
    return this.ejecucionRepo.save(ejecucion);
  }

  async registrarRechazo(id: string, cantidad: number): Promise<Ejecucion> {
    const ejecucion = await this.findOne(id);
    ejecucion.cantidadRechazada += cantidad;
    return this.ejecucionRepo.save(ejecucion);
  }

  async registrarParada(id: string, parada: any): Promise<Ejecucion> {
    const ejecucion = await this.findOne(id);
    
    const paradas = ejecucion.paradas || [];
    paradas.push(parada);
    
    ejecucion.paradas = paradas;
    ejecucion.estado = EstadoEjecucion.PAUSADA;

    return this.ejecucionRepo.save(ejecucion);
  }

  async finalizarEjecucion(id: string): Promise<Ejecucion> {
    const ejecucion = await this.findOne(id);
    
    ejecucion.estado = EstadoEjecucion.COMPLETADA;
    ejecucion.fechaFin = new Date();

    return this.ejecucionRepo.save(ejecucion);
  }

  async remove(id: string) {
    const ejecucion = await this.findOne(id);
    await this.ejecucionRepo.remove(ejecucion);
    
    return {
      success: true,
      message: 'Ejecución eliminada exitosamente',
    };
  }
}