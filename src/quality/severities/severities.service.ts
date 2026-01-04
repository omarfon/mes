import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Severity } from './entities/severity.entity';
import { CreateSeverityDto } from './dto/create-severity.dto';
import { UpdateSeverityDto } from './dto/update-severity.dto';

@Injectable()
export class SeveritiesService {
  constructor(
    @InjectRepository(Severity)
    private severityRepository: Repository<Severity>,
  ) {}

  async create(createDto: CreateSeverityDto): Promise<Severity> {
    const existing = await this.severityRepository.findOne({
      where: { code: createDto.code },
    });
    if (existing) {
      throw new ConflictException(`Severity with code ${createDto.code} already exists`);
    }

    const severity = this.severityRepository.create(createDto);
    return this.severityRepository.save(severity);
  }

  async findAll(isActive?: boolean): Promise<Severity[]> {
    const query = this.severityRepository.createQueryBuilder('severity');

    if (isActive !== undefined) {
      query.where('severity.isActive = :isActive', { isActive });
    }

    return query.orderBy('severity.level', 'ASC').getMany();
  }

  async findOne(id: string): Promise<Severity> {
    const severity = await this.severityRepository.findOne({ where: { id } });
    if (!severity) {
      throw new NotFoundException(`Severity with ID ${id} not found`);
    }
    return severity;
  }

  async findByCode(code: string): Promise<Severity> {
    const severity = await this.severityRepository.findOne({ where: { code } });
    if (!severity) {
      throw new NotFoundException(`Severity with code ${code} not found`);
    }
    return severity;
  }

  async update(id: string, updateDto: UpdateSeverityDto): Promise<Severity> {
    const severity = await this.findOne(id);

    if (updateDto.code && updateDto.code !== severity.code) {
      const existing = await this.severityRepository.findOne({
        where: { code: updateDto.code },
      });
      if (existing) {
        throw new ConflictException(`Severity with code ${updateDto.code} already exists`);
      }
    }

    Object.assign(severity, updateDto);
    return this.severityRepository.save(severity);
  }

  async remove(id: string): Promise<void> {
    const severity = await this.findOne(id);
    await this.severityRepository.remove(severity);
  }
}
