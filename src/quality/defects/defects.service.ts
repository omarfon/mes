import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Defect, DefectStatus } from './entities/defect.entity';
import { CreateDefectDto } from './dto/create-defect.dto';
import { UpdateDefectDto } from './dto/update-defect.dto';

@Injectable()
export class DefectsService {
  constructor(
    @InjectRepository(Defect)
    private defectRepository: Repository<Defect>,
  ) {}

  async create(createDto: CreateDefectDto): Promise<Defect> {
    const existing = await this.defectRepository.findOne({
      where: { code: createDto.code },
    });
    if (existing) {
      throw new ConflictException(`Defect with code ${createDto.code} already exists`);
    }

    const defect = this.defectRepository.create(createDto);
    return this.defectRepository.save(defect);
  }

  async findAll(filters?: {
    familyId?: string;
    severityId?: string;
    status?: DefectStatus;
    productId?: string;
    productionOrderId?: string;
    inspectionId?: string;
  }): Promise<Defect[]> {
    const query = this.defectRepository
      .createQueryBuilder('defect')
      .leftJoinAndSelect('defect.family', 'family')
      .leftJoinAndSelect('defect.severity', 'severity');

    if (filters?.familyId) {
      query.andWhere('defect.familyId = :familyId', { familyId: filters.familyId });
    }

    if (filters?.severityId) {
      query.andWhere('defect.severityId = :severityId', { severityId: filters.severityId });
    }

    if (filters?.status) {
      query.andWhere('defect.status = :status', { status: filters.status });
    }

    if (filters?.productId) {
      query.andWhere('defect.productId = :productId', { productId: filters.productId });
    }

    if (filters?.productionOrderId) {
      query.andWhere('defect.productionOrderId = :productionOrderId', {
        productionOrderId: filters.productionOrderId,
      });
    }

    if (filters?.inspectionId) {
      query.andWhere('defect.inspectionId = :inspectionId', {
        inspectionId: filters.inspectionId,
      });
    }

    return query.orderBy('defect.created_at', 'DESC').getMany();
  }

  async findOne(id: string): Promise<Defect> {
    const defect = await this.defectRepository.findOne({
      where: { id },
      relations: ['family', 'severity'],
    });
    if (!defect) {
      throw new NotFoundException(`Defect with ID ${id} not found`);
    }
    return defect;
  }

  async update(id: string, updateDto: UpdateDefectDto): Promise<Defect> {
    const defect = await this.findOne(id);

    if (updateDto.code && updateDto.code !== defect.code) {
      const existing = await this.defectRepository.findOne({
        where: { code: updateDto.code },
      });
      if (existing) {
        throw new ConflictException(`Defect with code ${updateDto.code} already exists`);
      }
    }

    Object.assign(defect, updateDto);
    return this.defectRepository.save(defect);
  }

  async updateStatus(id: string, status: DefectStatus, userId?: string): Promise<Defect> {
    const defect = await this.findOne(id);
    defect.status = status;

    if (status === DefectStatus.RESOLVED && userId) {
      defect.resolvedBy = userId;
      defect.resolvedAt = new Date();
    }

    return this.defectRepository.save(defect);
  }

  async remove(id: string): Promise<void> {
    const defect = await this.findOne(id);
    await this.defectRepository.remove(defect);
  }

  async getDefectsByFamily(): Promise<any> {
    return this.defectRepository
      .createQueryBuilder('defect')
      .select('defect.familyId', 'familyId')
      .addSelect('family.name', 'familyName')
      .addSelect('COUNT(*)', 'count')
      .leftJoin('defect.family', 'family')
      .groupBy('defect.familyId')
      .addGroupBy('family.name')
      .getRawMany();
  }

  async getDefectsBySeverity(): Promise<any> {
    return this.defectRepository
      .createQueryBuilder('defect')
      .select('defect.severityId', 'severityId')
      .addSelect('severity.name', 'severityName')
      .addSelect('severity.level', 'severityLevel')
      .addSelect('COUNT(*)', 'count')
      .leftJoin('defect.severity', 'severity')
      .groupBy('defect.severityId')
      .addGroupBy('severity.name')
      .addGroupBy('severity.level')
      .orderBy('severity.level', 'DESC')
      .getRawMany();
  }
}
