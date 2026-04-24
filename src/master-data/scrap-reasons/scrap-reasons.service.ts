import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { ScrapReason } from './entities/scrap-reason.entity';
import { CreateScrapReasonDto } from './dto/create-scrap-reason.dto';
import { UpdateScrapReasonDto } from './dto/update-scrap-reason.dto';
import { FilterScrapReasonDto } from './dto/filter-scrap-reason.dto';

@Injectable()
export class ScrapReasonsService {
  constructor(
    @InjectRepository(ScrapReason)
    private readonly scrapReasonsRepo: Repository<ScrapReason>,
  ) {}

  async create(dto: CreateScrapReasonDto): Promise<ScrapReason> {
    const existing = await this.scrapReasonsRepo.findOne({
      where: { code: dto.code.toUpperCase() },
      withDeleted: true,
    });

    if (existing) {
      throw new ConflictException('Scrap reason code already in use');
    }

    const scrapReason = this.scrapReasonsRepo.create({
      code: dto.code.toUpperCase(),
      name: dto.name,
      classification: dto.classification,
      description: dto.description || '',
      affectsEfficiency: dto.affectsEfficiency ?? true,
      reportable: dto.reportable ?? true,
      active: dto.active ?? true,
    });

    return this.scrapReasonsRepo.save(scrapReason);
  }

  async findAll(filter: FilterScrapReasonDto) {
    const { page = 1, limit = 20, search, classification, active } = filter;

    const where: any = {};

    if (typeof active === 'boolean') {
      where.active = active;
    }

    if (classification) {
      where.classification = classification;
    }

    if (search) {
      where.code = ILike(`%${search}%`);
    }

    const [data, total] = await this.scrapReasonsRepo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<ScrapReason> {
    const scrapReason = await this.scrapReasonsRepo.findOne({ where: { id } });

    if (!scrapReason) {
      throw new NotFoundException(`Scrap reason ${id} not found`);
    }

    return scrapReason;
  }

  async update(id: string, dto: UpdateScrapReasonDto): Promise<ScrapReason> {
    const scrapReason = await this.findOne(id);

    if (dto.code && dto.code.toUpperCase() !== scrapReason.code) {
      const exists = await this.scrapReasonsRepo.findOne({
        where: { code: dto.code.toUpperCase() },
      });

      if (exists) {
        throw new ConflictException('Scrap reason code already in use');
      }
    }

    Object.assign(scrapReason, {
      ...dto,
      code: dto.code ? dto.code.toUpperCase() : scrapReason.code,
    });

    return this.scrapReasonsRepo.save(scrapReason);
  }

  async remove(id: string): Promise<void> {
    const scrapReason = await this.findOne(id);
    await this.scrapReasonsRepo.softDelete(scrapReason.id);
  }

  async toggleActive(id: string, active: boolean): Promise<ScrapReason> {
    const scrapReason = await this.findOne(id);
    scrapReason.active = active;
    return this.scrapReasonsRepo.save(scrapReason);
  }
}
