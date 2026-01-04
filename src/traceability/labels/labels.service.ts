import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LabelTemplate } from './entities/label-template.entity';
import { LabelPrintHistory, PrintStatus } from './entities/label-print-history.entity';
import { CreateLabelTemplateDto } from './dto/create-label-template.dto';
import { UpdateLabelTemplateDto } from './dto/update-label-template.dto';
import { PrintLabelDto } from './dto/print-label.dto';

@Injectable()
export class LabelsService {
  constructor(
    @InjectRepository(LabelTemplate)
    private templateRepository: Repository<LabelTemplate>,
    @InjectRepository(LabelPrintHistory)
    private printHistoryRepository: Repository<LabelPrintHistory>,
  ) {}

  // Template Management
  async createTemplate(createDto: CreateLabelTemplateDto): Promise<LabelTemplate> {
    const template = this.templateRepository.create(createDto);
    return this.templateRepository.save(template);
  }

  async findAllTemplates(isActive?: boolean): Promise<LabelTemplate[]> {
    const query = this.templateRepository.createQueryBuilder('template');

    if (isActive !== undefined) {
      query.where('template.isActive = :isActive', { isActive });
    }

    return query.orderBy('template.name', 'ASC').getMany();
  }

  async findTemplateById(id: string): Promise<LabelTemplate> {
    const template = await this.templateRepository.findOne({ where: { id } });
    if (!template) {
      throw new NotFoundException(`Template with ID ${id} not found`);
    }
    return template;
  }

  async updateTemplate(id: string, updateDto: UpdateLabelTemplateDto): Promise<LabelTemplate> {
    const template = await this.findTemplateById(id);
    Object.assign(template, updateDto);
    return this.templateRepository.save(template);
  }

  // Print Management
  async printLabel(userId: string, printDto: PrintLabelDto): Promise<LabelPrintHistory> {
    const template = await this.findTemplateById(printDto.templateId);

    const printHistory = this.printHistoryRepository.create({
      ...printDto,
      userId,
      status: PrintStatus.PENDING,
    });

    // Aquí iría la lógica real de impresión
    // Por ahora solo guardamos el registro
    const savedHistory = await this.printHistoryRepository.save(printHistory);

    // Simular impresión exitosa
    savedHistory.status = PrintStatus.SUCCESS;
    return this.printHistoryRepository.save(savedHistory);
  }

  async getPrintHistory(filters?: {
    lotId?: string;
    serialId?: string;
    templateId?: string;
    status?: PrintStatus;
  }): Promise<LabelPrintHistory[]> {
    const query = this.printHistoryRepository
      .createQueryBuilder('history')
      .leftJoinAndSelect('history.template', 'template');

    if (filters?.lotId) {
      query.andWhere('history.lotId = :lotId', { lotId: filters.lotId });
    }

    if (filters?.serialId) {
      query.andWhere('history.serialId = :serialId', { serialId: filters.serialId });
    }

    if (filters?.templateId) {
      query.andWhere('history.templateId = :templateId', { templateId: filters.templateId });
    }

    if (filters?.status) {
      query.andWhere('history.status = :status', { status: filters.status });
    }

    return query.orderBy('history.printedAt', 'DESC').getMany();
  }
}
