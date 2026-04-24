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

@Injectable()
export class MaterialLotsService {
  constructor(
    @InjectRepository(MaterialLot)
    private readonly materialLotsRepo: Repository<MaterialLot>,
  ) {}

  async create(dto: CreateMaterialLotDto): Promise<MaterialLot> {
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

    return this.materialLotsRepo.save(materialLot);
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

  async update(id: string, dto: UpdateMaterialLotDto): Promise<MaterialLot> {
    const materialLot = await this.findOne(id);

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

    return this.materialLotsRepo.save(materialLot);
  }

  async remove(id: string): Promise<void> {
    const materialLot = await this.findOne(id);
    await this.materialLotsRepo.softDelete(materialLot.id);
  }
}
