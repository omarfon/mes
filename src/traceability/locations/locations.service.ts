import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location, LocationType } from './entities/location.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
  ) {}

  async create(createDto: CreateLocationDto): Promise<Location> {
    const location = this.locationRepository.create(createDto);
    return this.locationRepository.save(location);
  }

  async findAll(filters?: {
    type?: LocationType;
    isActive?: boolean;
    parentLocationId?: string;
  }): Promise<Location[]> {
    const query = this.locationRepository.createQueryBuilder('location');

    if (filters?.type) {
      query.andWhere('location.type = :type', { type: filters.type });
    }

    if (filters?.isActive !== undefined) {
      query.andWhere('location.isActive = :isActive', { isActive: filters.isActive });
    }

    if (filters?.parentLocationId) {
      query.andWhere('location.parentLocationId = :parentLocationId', {
        parentLocationId: filters.parentLocationId,
      });
    }

    return query.orderBy('location.code', 'ASC').getMany();
  }

  async findOne(id: string): Promise<Location> {
    const location = await this.locationRepository.findOne({
      where: { id },
      relations: ['parentLocation'],
    });
    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }
    return location;
  }

  async findByCode(code: string): Promise<Location> {
    const location = await this.locationRepository.findOne({
      where: { code },
      relations: ['parentLocation'],
    });
    if (!location) {
      throw new NotFoundException(`Location ${code} not found`);
    }
    return location;
  }

  async update(id: string, updateDto: UpdateLocationDto): Promise<Location> {
    const location = await this.findOne(id);
    Object.assign(location, updateDto);
    return this.locationRepository.save(location);
  }

  async updateCapacity(id: string, capacityChange: number): Promise<Location> {
    const location = await this.findOne(id);

    const newCapacity = Number(location.currentCapacity) + capacityChange;

    if (location.maxCapacity && newCapacity > Number(location.maxCapacity)) {
      throw new BadRequestException(
        `Capacity would exceed max capacity of ${location.maxCapacity}`,
      );
    }

    if (newCapacity < 0) {
      throw new BadRequestException('Capacity cannot be negative');
    }

    location.currentCapacity = newCapacity;
    return this.locationRepository.save(location);
  }

  async getHierarchy(locationId: string): Promise<any> {
    const location = await this.findOne(locationId);
    const children = await this.locationRepository.find({
      where: { parentLocationId: locationId },
    });

    return {
      ...location,
      children: await Promise.all(children.map((child) => this.getHierarchy(child.id))),
    };
  }

  async get3DMap(): Promise<Location[]> {
    return this.locationRepository
      .createQueryBuilder('location')
      .where('location.xCoordinate IS NOT NULL')
      .andWhere('location.yCoordinate IS NOT NULL')
      .andWhere('location.zCoordinate IS NOT NULL')
      .andWhere('location.isActive = :isActive', { isActive: true })
      .getMany();
  }
}
