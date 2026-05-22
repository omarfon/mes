import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Empresa } from './entities/empresa.entity';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { FilterEmpresaDto } from './dto/filter-empresa.dto';

import { AuditsService } from '../../traceability/audits/audits.service';
import { AuditAction } from '../../traceability/audits/entities/audit.entity';

const ENTITY_TYPE = 'Empresa';
const MODULE = 'master-data';

@Injectable()
export class EmpresasService {
  constructor(
    @InjectRepository(Empresa)
    private readonly empresasRepo: Repository<Empresa>,
    private readonly auditsService: AuditsService,
  ) {}

  async create(dto: CreateEmpresaDto, userId?: string, ip?: string): Promise<Empresa> {
    const existing = await this.empresasRepo.findOne({
      where: { ruc: dto.ruc },
      withDeleted: true,
    });

    if (existing) {
      throw new ConflictException('El RUC ya está registrado');
    }

    const empresa = this.empresasRepo.create({
      ruc: dto.ruc,
      name: dto.name,
      address: dto.address || '',
      phone: dto.phone || '',
      email: dto.email || '',
      active: dto.active ?? true,
    });

    const saved = await this.empresasRepo.save(empresa);
    await this.auditsService.create({ action: AuditAction.CREATE, entityType: ENTITY_TYPE, entityId: saved.id, userId, newValues: saved, module: MODULE, description: `Empresa creado`, ipAddress: ip });
    return saved;
  }

  async findAll(filter: FilterEmpresaDto) {
    const { page = 1, limit = 20, search, active } = filter;

    const where: any = {};

    if (typeof active === 'boolean') {
      where.active = active;
    }

    if (search) {
      where.name = ILike(`%${search}%`);
    }

    const [data, total] = await this.empresasRepo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { name: 'ASC' },
    });

    return { data, total, page, limit };
  }

  /** Listado simplificado id/ruc/name para selectores (sin paginación) */
  async listForSelect(search?: string): Promise<{ id: string; ruc: string; name: string }[]> {
    const qb = this.empresasRepo
      .createQueryBuilder('e')
      .select(['e.id', 'e.ruc', 'e.name'])
      .where('e.active = true')
      .orderBy('e.name', 'ASC');

    if (search) {
      qb.andWhere('e.name ILIKE :search OR e.ruc ILIKE :search', {
        search: `%${search}%`,
      });
    }

    return qb.getMany();
  }

  async findOne(id: string): Promise<Empresa> {
    const empresa = await this.empresasRepo.findOne({ where: { id } });

    if (!empresa) {
      throw new NotFoundException(`Empresa ${id} no encontrada`);
    }

    return empresa;
  }

  async update(id: string, dto: UpdateEmpresaDto, userId?: string, ip?: string): Promise<Empresa> {
    const empresa = await this.findOne(id);
    const oldValues = { ...empresa };

    if (dto.ruc && dto.ruc !== empresa.ruc) {
      const exists = await this.empresasRepo.findOne({
        where: { ruc: dto.ruc },
      });

      if (exists) {
        throw new ConflictException('El RUC ya está registrado');
      }
    }

    Object.assign(empresa, dto);

    const updated = await this.empresasRepo.save(empresa);
    await this.auditsService.create({ action: AuditAction.UPDATE, entityType: ENTITY_TYPE, entityId: id, userId, oldValues, newValues: updated, module: MODULE, description: `Empresa actualizado`, ipAddress: ip });
    return updated;
  }

  async remove(id: string, userId?: string, ip?: string): Promise<void> {
    const empresa = await this.findOne(id);
    await this.empresasRepo.softDelete(empresa.id);
    await this.auditsService.create({ action: AuditAction.DELETE, entityType: ENTITY_TYPE, entityId: id, userId, oldValues: empresa, module: MODULE, description: `Empresa eliminado`, ipAddress: ip });
  }

  async toggleActive(id: string, active: boolean): Promise<Empresa> {
    const empresa = await this.findOne(id);
    empresa.active = active;
    return this.empresasRepo.save(empresa);
  }
}
