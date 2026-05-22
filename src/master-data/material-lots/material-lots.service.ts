import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { MaterialLot, LotStatus } from './entities/material-lot.entity';
import { CreateMaterialLotDto } from './dto/create-material-lot.dto';
import { UpdateMaterialLotDto } from './dto/update-material-lot.dto';
import { FilterMaterialLotDto } from './dto/filter-material-lot.dto';

import { AuditsService } from '../../traceability/audits/audits.service';
import { AuditAction } from '../../traceability/audits/entities/audit.entity';

const ENTITY_TYPE = 'MaterialLot';
const MODULE = 'master-data';

@Injectable()
export class MaterialLotsService {
  constructor(
    @InjectRepository(MaterialLot)
    private readonly materialLotsRepo: Repository<MaterialLot>,
    private readonly auditsService: AuditsService,
  ) {}

  async create(dto: CreateMaterialLotDto, userId?: string, ip?: string): Promise<MaterialLot> {
    const existing = await this.materialLotsRepo.findOne({
      where: { lotNumber: dto.lotNumber.toUpperCase() },
      withDeleted: true,
    });

    if (existing) {
      throw new ConflictException('Lot number already in use');
    }

    const materialLot = this.materialLotsRepo.create({
      lotNumber: dto.lotNumber.toUpperCase(),
      materialCode: dto.materialCode.toUpperCase(),
      materialName: dto.materialName,
      supplierCode: dto.supplierCode || '',
      supplierLot: dto.supplierLot || '',
      receivedDate: dto.receivedDate,
      expiryDate: dto.expiryDate,
      initialQty: dto.initialQty,
      availableQty: dto.availableQty,
      uom: dto.uom,
      locationCode: dto.locationCode || '',
      status: dto.status ?? LotStatus.AVAILABLE,
      notes: dto.notes || '',
    });

    const saved = await this.materialLotsRepo.save(materialLot);
    await this.auditsService.create({ action: AuditAction.CREATE, entityType: ENTITY_TYPE, entityId: saved.id, userId, newValues: saved, module: MODULE, description: `MaterialLot creado`, ipAddress: ip });
    return saved;
  }

  async findAll(filter: FilterMaterialLotDto) {
    const { page = 1, limit = 20, search, materialCode, locationCode, status } = filter;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (materialCode) {
      where.materialCode = materialCode.toUpperCase();
    }

    if (locationCode) {
      where.locationCode = locationCode.toUpperCase();
    }

    if (search) {
      where.lotNumber = ILike(`%${search}%`);
    }

    const [data, total] = await this.materialLotsRepo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { receivedDate: 'DESC' },
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<MaterialLot> {
    const materialLot = await this.materialLotsRepo.findOne({ where: { id } });

    if (!materialLot) {
      throw new NotFoundException(`Material lot ${id} not found`);
    }

    return materialLot;
  }

  async update(id: string, dto: UpdateMaterialLotDto, userId?: string, ip?: string): Promise<MaterialLot> {
    const materialLot = await this.findOne(id);
    const oldValues = { ...materialLot };

    if (dto.lotNumber && dto.lotNumber.toUpperCase() !== materialLot.lotNumber) {
      const exists = await this.materialLotsRepo.findOne({
        where: { lotNumber: dto.lotNumber.toUpperCase() },
      });

      if (exists) {
        throw new ConflictException('Lot number already in use');
      }
    }

    Object.assign(materialLot, {
      ...dto,
      lotNumber: dto.lotNumber ? dto.lotNumber.toUpperCase() : materialLot.lotNumber,
      materialCode: dto.materialCode ? dto.materialCode.toUpperCase() : materialLot.materialCode,
      supplierCode: dto.supplierCode !== undefined ? dto.supplierCode : materialLot.supplierCode,
      supplierLot: dto.supplierLot !== undefined ? dto.supplierLot : materialLot.supplierLot,
      locationCode: dto.locationCode !== undefined ? dto.locationCode : materialLot.locationCode,
      notes: dto.notes !== undefined ? dto.notes : materialLot.notes,
    });

    const updated = await this.materialLotsRepo.save(materialLot);
    await this.auditsService.create({ action: AuditAction.UPDATE, entityType: ENTITY_TYPE, entityId: id, userId, oldValues, newValues: updated, module: MODULE, description: `MaterialLot actualizado`, ipAddress: ip });
    return updated;
  }

  async remove(id: string, userId?: string, ip?: string): Promise<void> {
    const materialLot = await this.findOne(id);
    await this.materialLotsRepo.softDelete(materialLot.id);
    await this.auditsService.create({ action: AuditAction.DELETE, entityType: ENTITY_TYPE, entityId: id, userId, oldValues: materialLot, module: MODULE, description: `MaterialLot eliminado`, ipAddress: ip });
  }
}
