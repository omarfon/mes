import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { BillOfMaterial } from './entities/bill-of-material.entity';
import { BomLine } from './entities/bom-line.entity';
import { CreateBillOfMaterialDto, CreateBomLineDto } from './dto/create-bill-of-material.dto';
import { UpdateBillOfMaterialDto, UpdateBomLineDto } from './dto/update-bill-of-material.dto';
import { FilterBillOfMaterialDto } from './dto/filter-bill-of-material.dto';

@Injectable()
export class BillOfMaterialsService {
  constructor(
    @InjectRepository(BillOfMaterial)
    private readonly bomsRepo: Repository<BillOfMaterial>,
    @InjectRepository(BomLine)
    private readonly linesRepo: Repository<BomLine>,
  ) {}

  async create(dto: CreateBillOfMaterialDto): Promise<BillOfMaterial> {
    const existing = await this.bomsRepo.findOne({
      where: { code: dto.code.toUpperCase() },
      withDeleted: true,
    });

    if (existing) {
      throw new ConflictException('BOM code already in use');
    }

    const bom = this.bomsRepo.create({
      code: dto.code.toUpperCase(),
      productCode: dto.productCode.toUpperCase(),
      productName: dto.productName,
      version: dto.version ?? '1.0',
      baseQty: dto.baseQty ?? 1,
      baseUom: dto.baseUom,
      validFrom: dto.validFrom,
      active: dto.active ?? true,
    });

    const saved = await this.bomsRepo.save(bom);

    if (dto.lines && dto.lines.length > 0) {
      const lines = dto.lines.map((line) =>
        this.linesRepo.create({
          bomId: saved.id,
          ...line,
          materialCode: line.materialCode.toUpperCase(),
          phase: line.phase || '',
          notes: line.notes || '',
        }),
      );
      await this.linesRepo.save(lines);
    }

    return this.findOne(saved.id);
  }

  async findAll(filter: FilterBillOfMaterialDto) {
    const { page = 1, limit = 20, search, productCode, active } = filter;

    const where: any = {};

    if (typeof active === 'boolean') {
      where.active = active;
    }

    if (productCode) {
      where.productCode = productCode.toUpperCase();
    }

    if (search) {
      where.code = ILike(`%${search}%`);
    }

    const [data, total] = await this.bomsRepo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['lines'],
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<BillOfMaterial> {
    const bom = await this.bomsRepo.findOne({
      where: { id },
      relations: ['lines'],
    });

    if (!bom) {
      throw new NotFoundException(`Bill of Material ${id} not found`);
    }

    return bom;
  }

  async update(id: string, dto: UpdateBillOfMaterialDto): Promise<BillOfMaterial> {
    const bom = await this.findOne(id);

    if (dto.code && dto.code.toUpperCase() !== bom.code) {
      const exists = await this.bomsRepo.findOne({
        where: { code: dto.code.toUpperCase() },
      });

      if (exists) {
        throw new ConflictException('BOM code already in use');
      }
    }

    Object.assign(bom, {
      ...dto,
      code: dto.code ? dto.code.toUpperCase() : bom.code,
      productCode: dto.productCode ? dto.productCode.toUpperCase() : bom.productCode,
    });

    return this.bomsRepo.save(bom);
  }

  async remove(id: string): Promise<void> {
    const bom = await this.findOne(id);
    await this.bomsRepo.softDelete(bom.id);
  }

  async toggleActive(id: string, active: boolean): Promise<BillOfMaterial> {
    const bom = await this.findOne(id);
    bom.active = active;
    return this.bomsRepo.save(bom);
  }

  // Lines CRUD
  async createLine(bomId: string, dto: CreateBomLineDto): Promise<BomLine> {
    const bom = await this.findOne(bomId);

    const line = this.linesRepo.create({
      bomId: bom.id,
      ...dto,
      materialCode: dto.materialCode.toUpperCase(),
      phase: dto.phase || '',
      notes: dto.notes || '',
    });

    return this.linesRepo.save(line);
  }

  async getLines(bomId: string): Promise<BomLine[]> {
    await this.findOne(bomId);

    return this.linesRepo.find({
      where: { bomId },
      order: { materialCode: 'ASC' },
    });
  }

  async updateLine(bomId: string, lineId: string, dto: UpdateBomLineDto): Promise<BomLine> {
    const line = await this.linesRepo.findOne({ where: { id: lineId, bomId } });

    if (!line) {
      throw new NotFoundException(`BOM line ${lineId} not found`);
    }

    Object.assign(line, {
      ...dto,
      materialCode: dto.materialCode ? dto.materialCode.toUpperCase() : line.materialCode,
    });

    return this.linesRepo.save(line);
  }

  async deleteLine(bomId: string, lineId: string): Promise<void> {
    const line = await this.linesRepo.findOne({ where: { id: lineId, bomId } });

    if (!line) {
      throw new NotFoundException(`BOM line ${lineId} not found`);
    }

    await this.linesRepo.remove(line);
  }
}
