import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Lot, LotStatus } from './entities/lot.entity';
import { CreateLotDto } from './dto/create-lot.dto';
import { UpdateLotDto } from './dto/update-lot.dto';
import { UpdateLotStatusDto } from './dto/update-lot-status.dto';
import { BlockLotDto } from './dto/block-lot.dto';
import { QuarantineLotDto } from './dto/quarantine-lot.dto';

@Injectable()
export class LotsService {
  constructor(
    @InjectRepository(Lot)
    private readonly lotRepository: Repository<Lot>,
  ) {}

  async create(createDto: CreateLotDto): Promise<Lot> {
    const existing = await this.lotRepository.findOne({
      where: { lotNumber: createDto.lotNumber },
    });

    if (existing) {
      throw new BadRequestException(`Lot number ${createDto.lotNumber} already exists`);
    }

    const lot = this.lotRepository.create({
      ...createDto,
      quantityCurrent: createDto.quantityInitial,
      status: createDto.status || LotStatus.CREATED,
    });

    return await this.lotRepository.save(lot);
  }

  async findAll(filters?: any): Promise<Lot[]> {
    const where: any = {};

    if (filters?.productId) where.productId = filters.productId;
    if (filters?.status) where.status = filters.status;
    if (filters?.locationId) where.locationId = filters.locationId;
    if (filters?.isBlocked !== undefined) where.isBlocked = filters.isBlocked;
    if (filters?.isInQuarantine !== undefined) where.isInQuarantine = filters.isInQuarantine;

    if (filters?.search) {
      return await this.lotRepository.find({
        where: [
          { lotNumber: Like(`%${filters.search}%`) },
          { internalCode: Like(`%${filters.search}%`) },
          { externalCode: Like(`%${filters.search}%`) },
          { productCode: Like(`%${filters.search}%`) },
        ],
        order: { fechaCreacion: 'DESC' },
      });
    }

    return await this.lotRepository.find({
      where,
      order: { fechaCreacion: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Lot> {
    const lot = await this.lotRepository.findOne({ where: { id } });

    if (!lot) {
      throw new NotFoundException(`Lot with ID ${id} not found`);
    }

    return lot;
  }

  async findByLotNumber(lotNumber: string): Promise<Lot> {
    const lot = await this.lotRepository.findOne({ where: { lotNumber } });

    if (!lot) {
      throw new NotFoundException(`Lot ${lotNumber} not found`);
    }

    return lot;
  }

  async update(id: string, updateDto: UpdateLotDto): Promise<Lot> {
    const lot = await this.findOne(id);
    Object.assign(lot, updateDto);
    return await this.lotRepository.save(lot);
  }

  async updateStatus(id: string, statusDto: UpdateLotStatusDto): Promise<Lot> {
    const lot = await this.findOne(id);
    lot.status = statusDto.status;

    if (statusDto.reason && lot.metadata) {
      lot.metadata = {
        ...lot.metadata,
        statusChangeReason: statusDto.reason,
        statusChangedAt: new Date(),
      };
    }

    return await this.lotRepository.save(lot);
  }

  async block(id: string, blockDto: BlockLotDto): Promise<Lot> {
    const lot = await this.findOne(id);
    lot.isBlocked = blockDto.isBlocked;
    lot.blockReason = blockDto.reason;

    if (blockDto.isBlocked) {
      lot.quantityBlocked = lot.quantityCurrent - lot.quantityReserved;
    } else {
      lot.quantityBlocked = 0;
    }

    return await this.lotRepository.save(lot);
  }

  async quarantine(id: string, quarantineDto: QuarantineLotDto): Promise<Lot> {
    const lot = await this.findOne(id);
    lot.isInQuarantine = quarantineDto.isInQuarantine;
    lot.quarantineReason = quarantineDto.reason;

    if (quarantineDto.isInQuarantine) {
      lot.status = LotStatus.IN_QUARANTINE;
    }

    return await this.lotRepository.save(lot);
  }

  async updateQuantity(id: string, quantity: number): Promise<Lot> {
    const lot = await this.findOne(id);
    lot.quantityCurrent = quantity;

    if (lot.quantityCurrent < 0) {
      throw new BadRequestException('Quantity cannot be negative');
    }

    return await this.lotRepository.save(lot);
  }

  async remove(id: string): Promise<void> {
    const lot = await this.findOne(id);
    await this.lotRepository.remove(lot);
  }
}
