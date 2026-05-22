import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Turno } from './entities/turno.entity';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';
import { FilterTurnoDto } from './dto/filter-turno.dto';

import { AuditsService } from '../../traceability/audits/audits.service';
import { AuditAction } from '../../traceability/audits/entities/audit.entity';

const ENTITY_TYPE = 'Turno';
const MODULE = 'master-data';

@Injectable()
export class TurnosService {
  constructor(
    @InjectRepository(Turno)
    private readonly turnosRepo: Repository<Turno>,
    private readonly auditsService: AuditsService,
  ) {}

  /**
   * Crear un nuevo turno
   */
  async create(dto: CreateTurnoDto, userId?: string, ip?: string): Promise<Turno> {
    // Verificar que no exista un turno con el mismo código
    const existing = await this.turnosRepo.findOne({
      where: { codigo: dto.codigo },
      withDeleted: true,
    });

    if (existing) {
      throw new ConflictException(`Ya existe un turno con el código ${dto.codigo}`);
    }

    const turno = this.turnosRepo.create(dto);
    const saved = await this.turnosRepo.save(turno);
    await this.auditsService.create({ action: AuditAction.CREATE, entityType: ENTITY_TYPE, entityId: saved.id, userId, newValues: saved, module: MODULE, description: `Turno creado`, ipAddress: ip });
    return saved;
  }

  /**
   * Listar turnos con filtros y paginación
   */
  async findAll(filter: FilterTurnoDto) {
    const { page = 1, limit = 20, search, activo } = filter;

    const where: any = {};

    if (search) {
      // Búsqueda por código o nombre
      where.codigo = ILike(`%${search}%`);
    }

    if (activo !== undefined) {
      where.activo = activo;
    }

    const [data, total] = await this.turnosRepo.findAndCount({
      where,
      take: limit,
      skip: (page - 1) * limit,
      order: { codigo: 'ASC' },
    });

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

  /**
   * Obtener un turno por ID
   */
  async findOne(id: string): Promise<Turno> {
    const turno = await this.turnosRepo.findOne({
      where: { id },
    });

    if (!turno) {
      throw new NotFoundException(`Turno con id ${id} no encontrado`);
    }

    return turno;
  }

  /**
   * Obtener un turno por código
   */
  async findByCodigo(codigo: string): Promise<Turno> {
    const turno = await this.turnosRepo.findOne({
      where: { codigo },
    });

    if (!turno) {
      throw new NotFoundException(`Turno con código ${codigo} no encontrado`);
    }

    return turno;
  }

  /**
   * Actualizar un turno
   */
  async update(id: string, dto: UpdateTurnoDto, userId?: string, ip?: string): Promise<Turno> {
    const turno = await this.findOne(id);
    const oldValues = { ...turno };

    // Si se está cambiando el código, verificar que no exista otro con ese código
    if (dto.codigo && dto.codigo !== turno.codigo) {
      const existing = await this.turnosRepo.findOne({
        where: { codigo: dto.codigo },
        withDeleted: true,
      });

      if (existing) {
        throw new ConflictException(`Ya existe un turno con el código ${dto.codigo}`);
      }
    }

    Object.assign(turno, dto);
    const updated = await this.turnosRepo.save(turno);
    await this.auditsService.create({ action: AuditAction.UPDATE, entityType: ENTITY_TYPE, entityId: id, userId, oldValues, newValues: updated, module: MODULE, description: `Turno actualizado`, ipAddress: ip });
    return updated;
  }

  /**
   * Soft delete de un turno
   */
  async remove(id: string, userId?: string, ip?: string): Promise<void> {
    const turno = await this.findOne(id);
    await this.turnosRepo.softDelete(turno.id);
    await this.auditsService.create({ action: AuditAction.DELETE, entityType: ENTITY_TYPE, entityId: id, userId, oldValues: turno, module: MODULE, description: `Turno eliminado`, ipAddress: ip });
  }

  /**
   * Restaurar un turno eliminado
   */
  async restore(id: string): Promise<Turno> {
    await this.turnosRepo.restore(id);
    return this.findOne(id);
  }

  /**
   * Activar/desactivar un turno
   */
  async toggleActive(id: string): Promise<Turno> {
    const turno = await this.findOne(id);
    turno.activo = !turno.activo;
    return this.turnosRepo.save(turno);
  }
}
