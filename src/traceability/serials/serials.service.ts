import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Serial, SerialStatus } from './entities/serial.entity';
import { CreateSerialDto } from './dto/create-serial.dto';
import { UpdateSerialDto } from './dto/update-serial.dto';

@Injectable()
export class SerialsService {
  constructor(
    @InjectRepository(Serial)
    private serialRepository: Repository<Serial>,
  ) {}

  async create(createDto: CreateSerialDto): Promise<Serial> {
    // Verificar que el número de serie no exista
    const existing = await this.serialRepository.findOne({
      where: { serialNumber: createDto.serialNumber },
    });
    if (existing) {
      throw new ConflictException(`Serial number ${createDto.serialNumber} already exists`);
    }

    const serial = this.serialRepository.create(createDto);
    return this.serialRepository.save(serial);
  }

  async findAll(filters?: {
    lotId?: string;
    productId?: string;
    status?: SerialStatus;
    customerId?: string;
  }): Promise<Serial[]> {
    const query = this.serialRepository.createQueryBuilder('serial');

    if (filters?.lotId) {
      query.andWhere('serial.lotId = :lotId', { lotId: filters.lotId });
    }

    if (filters?.productId) {
      query.andWhere('serial.productId = :productId', { productId: filters.productId });
    }

    if (filters?.status) {
      query.andWhere('serial.status = :status', { status: filters.status });
    }

    if (filters?.customerId) {
      query.andWhere('serial.customerId = :customerId', { customerId: filters.customerId });
    }

    return query.orderBy('serial.createdAt', 'DESC').getMany();
  }

  async findOne(id: string): Promise<Serial> {
    const serial = await this.serialRepository.findOne({
      where: { id },
      relations: ['lot'],
    });
    if (!serial) {
      throw new NotFoundException(`Serial with ID ${id} not found`);
    }
    return serial;
  }

  async findBySerialNumber(serialNumber: string): Promise<Serial> {
    const serial = await this.serialRepository.findOne({
      where: { serialNumber },
      relations: ['lot'],
    });
    if (!serial) {
      throw new NotFoundException(`Serial ${serialNumber} not found`);
    }
    return serial;
  }

  async update(id: string, updateDto: UpdateSerialDto): Promise<Serial> {
    const serial = await this.findOne(id);

    // Si se actualiza el número de serie, verificar que no exista
    if (updateDto.serialNumber && updateDto.serialNumber !== serial.serialNumber) {
      const existing = await this.serialRepository.findOne({
        where: { serialNumber: updateDto.serialNumber },
      });
      if (existing) {
        throw new ConflictException(`Serial number ${updateDto.serialNumber} already exists`);
      }
    }

    Object.assign(serial, updateDto);
    return this.serialRepository.save(serial);
  }

  async updateStatus(id: string, status: SerialStatus): Promise<Serial> {
    const serial = await this.findOne(id);
    serial.status = status;
    return this.serialRepository.save(serial);
  }

  async findByLotId(lotId: string): Promise<Serial[]> {
    return this.serialRepository.find({
      where: { lotId },
      order: { createdAt: 'DESC' },
    });
  }

  async findInWarranty(): Promise<Serial[]> {
    const now = new Date();
    return this.serialRepository
      .createQueryBuilder('serial')
      .where('serial.warrantyEndDate > :now', { now })
      .andWhere('serial.status = :status', { status: SerialStatus.IN_WARRANTY })
      .orderBy('serial.warrantyEndDate', 'ASC')
      .getMany();
  }
}
