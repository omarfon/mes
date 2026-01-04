import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DefectFamily } from './entities/defect-family.entity';
import { CreateDefectFamilyDto } from './dto/create-defect-family.dto';
import { UpdateDefectFamilyDto } from './dto/update-defect-family.dto';

@Injectable()
export class FamiliesService {
  constructor(
    @InjectRepository(DefectFamily)
    private familyRepository: Repository<DefectFamily>,
  ) {}

  async create(createDto: CreateDefectFamilyDto): Promise<DefectFamily> {
    const existing = await this.familyRepository.findOne({
      where: { code: createDto.code },
    });
    if (existing) {
      throw new ConflictException(`Defect family with code ${createDto.code} already exists`);
    }

    const family = this.familyRepository.create(createDto);
    return this.familyRepository.save(family);
  }

  async findAll(isActive?: boolean): Promise<DefectFamily[]> {
    const query = this.familyRepository.createQueryBuilder('family');

    if (isActive !== undefined) {
      query.where('family.isActive = :isActive', { isActive });
    }

    return query.orderBy('family.name', 'ASC').getMany();
  }

  async findOne(id: string): Promise<DefectFamily> {
    const family = await this.familyRepository.findOne({ where: { id } });
    if (!family) {
      throw new NotFoundException(`Defect family with ID ${id} not found`);
    }
    return family;
  }

  async update(id: string, updateDto: UpdateDefectFamilyDto): Promise<DefectFamily> {
    const family = await this.findOne(id);

    if (updateDto.code && updateDto.code !== family.code) {
      const existing = await this.familyRepository.findOne({
        where: { code: updateDto.code },
      });
      if (existing) {
        throw new ConflictException(`Defect family with code ${updateDto.code} already exists`);
      }
    }

    Object.assign(family, updateDto);
    return this.familyRepository.save(family);
  }

  async remove(id: string): Promise<void> {
    const family = await this.findOne(id);
    await this.familyRepository.remove(family);
  }
}
