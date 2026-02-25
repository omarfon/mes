import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Component } from './entities/component.entity';
import { MaintenanceRecord } from './entities/maintenance-record.entity';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';
import { FilterComponentsDto } from './dto/filter-components.dto';
import { CreateMaintenanceRecordDto } from './dto/create-maintenance-record.dto';

@Injectable()
export class ComponentsService {
  constructor(
    @InjectRepository(Component)
    private readonly componentRepository: Repository<Component>,
    @InjectRepository(MaintenanceRecord)
    private readonly maintenanceRecordRepository: Repository<MaintenanceRecord>,
  ) {}

  async create(createComponentDto: CreateComponentDto): Promise<Component> {
    const component = this.componentRepository.create(createComponentDto);
    return await this.componentRepository.save(component);
  }

  async findAll(filters?: FilterComponentsDto): Promise<Component[]> {
    const query = this.componentRepository.createQueryBuilder('component');

    if (filters?.q) {
      query.andWhere(
        '(component.code ILIKE :search OR component.name ILIKE :search OR component.category ILIKE :search)',
        { search: `%${filters.q}%` },
      );
    }

    if (filters?.assetCode && filters.assetCode !== 'ALL') {
      query.andWhere('component.assetCode = :assetCode', { assetCode: filters.assetCode });
    }

    if (filters?.status !== undefined && String(filters.status) !== 'ALL') {
      query.andWhere('component.status = :status', { status: filters.status });
    }

    query.orderBy('component.createdAt', 'DESC');

    return await query.getMany();
  }

  async findOne(id: string): Promise<Component> {
    const component = await this.componentRepository.findOne({
      where: { id },
      relations: ['maintenanceRecords'],
    });

    if (!component) {
      throw new NotFoundException(`Component with ID ${id} not found`);
    }

    return component;
  }

  async update(id: string, updateComponentDto: UpdateComponentDto): Promise<Component> {
    const component = await this.findOne(id);
    Object.assign(component, updateComponentDto);
    return await this.componentRepository.save(component);
  }

  async remove(id: string): Promise<void> {
    const component = await this.findOne(id);
    await this.componentRepository.remove(component);
  }

  async getUniqueAssets(): Promise<string[]> {
    const components = await this.componentRepository
      .createQueryBuilder('component')
      .select('DISTINCT component.assetCode', 'assetCode')
      .where('component.assetCode IS NOT NULL')
      .getRawMany();

    return components.map((c) => c.assetCode).filter(Boolean);
  }

  async addMaintenanceRecord(
    componentId: string,
    createRecordDto: CreateMaintenanceRecordDto,
  ): Promise<MaintenanceRecord> {
    const component = await this.findOne(componentId);

    const record = this.maintenanceRecordRepository.create({
      ...createRecordDto,
      componentId: component.id,
    });

    const savedRecord = await this.maintenanceRecordRepository.save(record);

    // Actualizar lastInspection si es una inspección
    if (createRecordDto.type === 'INSPECTION') {
      component.lastInspection = createRecordDto.date;
      await this.componentRepository.save(component);
    }

    return savedRecord;
  }

  async getMaintenanceRecords(componentId: string): Promise<MaintenanceRecord[]> {
    await this.findOne(componentId); // Verificar que existe

    return await this.maintenanceRecordRepository.find({
      where: { componentId },
      order: { date: 'DESC' },
    });
  }

  async updateHours(id: string, hours: number): Promise<Component> {
    const component = await this.findOne(id);
    component.currentHours = hours;
    return await this.componentRepository.save(component);
  }

  calculateLifePercentage(component: Component): number {
    if (!component.expectedLifeHours || !component.currentHours) {
      return 0;
    }
    return Math.min((component.currentHours / component.expectedLifeHours) * 100, 100);
  }
}
