// src/production/control-visual/control-visual.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ControlVisual, EstadoVisual } from './entities/control-visual.entity';
import { CreateControlVisualDto } from './dto/create-control-visual.dto';
import { UpdateControlVisualDto } from './dto/update-control-visual.dto';
import { FilterControlVisualDto } from './dto/filter-control-visual.dto';

@Injectable()
export class ControlVisualService {
  constructor(
    @InjectRepository(ControlVisual)
    private readonly controlVisualRepo: Repository<ControlVisual>,
  ) {}

  async create(dto: CreateControlVisualDto): Promise<ControlVisual> {
    const controlVisual = this.controlVisualRepo.create({
      ...dto,
      ultimaActualizacion: new Date(),
    });
    return this.controlVisualRepo.save(controlVisual);
  }

  async findAll(filter: FilterControlVisualDto) {
    const {
      page = 1,
      limit = 20,
      estado,
      tipoAlerta,
      maquinaId,
      workCenterId,
      alertaActiva,
      requiereAtencion,
      isActive,
    } = filter;

    const queryBuilder = this.controlVisualRepo
      .createQueryBuilder('cv')
      .leftJoinAndSelect('cv.maquina', 'maquina')
      .leftJoinAndSelect('cv.workCenter', 'workCenter');

    if (estado) {
      queryBuilder.andWhere('cv.estado = :estado', { estado });
    }

    if (tipoAlerta) {
      queryBuilder.andWhere('cv.tipoAlerta = :tipoAlerta', { tipoAlerta });
    }

    if (maquinaId) {
      queryBuilder.andWhere('cv.maquinaId = :maquinaId', { maquinaId });
    }

    if (workCenterId) {
      queryBuilder.andWhere('cv.workCenterId = :workCenterId', { workCenterId });
    }

    if (typeof alertaActiva === 'boolean') {
      queryBuilder.andWhere('cv.alertaActiva = :alertaActiva', { alertaActiva });
    }

    if (typeof requiereAtencion === 'boolean') {
      queryBuilder.andWhere('cv.requiereAtencion = :requiereAtencion', { requiereAtencion });
    }

    if (typeof isActive === 'boolean') {
      queryBuilder.andWhere('cv.isActive = :isActive', { isActive });
    }

    const [data, total] = await queryBuilder
      .take(limit)
      .skip((page - 1) * limit)
      .orderBy('cv.ultimaActualizacion', 'DESC')
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

  async findOne(id: string): Promise<ControlVisual> {
    const controlVisual = await this.controlVisualRepo.findOne({
      where: { id },
      relations: ['maquina', 'workCenter'],
    });

    if (!controlVisual) {
      throw new NotFoundException(`Control Visual con id ${id} no encontrado`);
    }

    return controlVisual;
  }

  async findByMaquina(maquinaId: string): Promise<ControlVisual[]> {
    return this.controlVisualRepo.find({
      where: { maquinaId, isActive: true },
      relations: ['maquina', 'workCenter'],
      order: { ultimaActualizacion: 'DESC' },
    });
  }

  async findByWorkCenter(workCenterId: string): Promise<ControlVisual[]> {
    return this.controlVisualRepo.find({
      where: { workCenterId, isActive: true },
      relations: ['maquina', 'workCenter'],
      order: { ultimaActualizacion: 'DESC' },
    });
  }

  async getAlertas(): Promise<ControlVisual[]> {
    return this.controlVisualRepo.find({
      where: { alertaActiva: true, isActive: true },
      relations: ['maquina', 'workCenter'],
      order: { ultimaActualizacion: 'DESC' },
    });
  }

  async getTablero() {
    const data = await this.controlVisualRepo.find({
      where: { isActive: true },
      relations: ['maquina', 'workCenter'],
      order: { ultimaActualizacion: 'DESC' },
    });

    const resumen = {
      total: data.length,
      normal: data.filter(d => d.estado === EstadoVisual.NORMAL).length,
      advertencia: data.filter(d => d.estado === EstadoVisual.ADVERTENCIA).length,
      critico: data.filter(d => d.estado === EstadoVisual.CRITICO).length,
      detenido: data.filter(d => d.estado === EstadoVisual.DETENIDO).length,
      alertasActivas: data.filter(d => d.alertaActiva).length,
      requierenAtencion: data.filter(d => d.requiereAtencion).length,
    };

    return {
      resumen,
      data,
    };
  }

  async update(id: string, dto: UpdateControlVisualDto): Promise<ControlVisual> {
    const controlVisual = await this.findOne(id);
    Object.assign(controlVisual, dto);
    controlVisual.ultimaActualizacion = new Date();
    return this.controlVisualRepo.save(controlVisual);
  }

  async activarAlerta(id: string, tipoAlerta: any, mensaje: string): Promise<ControlVisual> {
    const controlVisual = await this.findOne(id);
    controlVisual.alertaActiva = true;
    controlVisual.tipoAlerta = tipoAlerta;
    controlVisual.mensaje = mensaje;
    controlVisual.requiereAtencion = true;
    controlVisual.ultimaActualizacion = new Date();
    return this.controlVisualRepo.save(controlVisual);
  }

  async desactivarAlerta(id: string): Promise<ControlVisual> {
    const controlVisual = await this.findOne(id);
    controlVisual.alertaActiva = false;
    controlVisual.requiereAtencion = false;
    controlVisual.mensaje = '';
    controlVisual.ultimaActualizacion = new Date();
    return this.controlVisualRepo.save(controlVisual);
  }

  async actualizarMetricas(id: string, metricas: any): Promise<ControlVisual> {
    const controlVisual = await this.findOne(id);
    controlVisual.metricas = metricas;
    controlVisual.ultimaActualizacion = new Date();
    return this.controlVisualRepo.save(controlVisual);
  }

  async remove(id: string) {
    const controlVisual = await this.findOne(id);
    await this.controlVisualRepo.remove(controlVisual);
    
    return {
      success: true,
      message: 'Control Visual eliminado exitosamente',
    };
  }

  async desactivar(id: string): Promise<ControlVisual> {
    const controlVisual = await this.findOne(id);
    controlVisual.isActive = false;
    return this.controlVisualRepo.save(controlVisual);
  }
}