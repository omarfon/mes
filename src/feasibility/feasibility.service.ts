import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeasibilityHistory } from './entities/feasibility-history.entity';
import { FilterFeasibilityHistoryDto } from './dto/filter-feasibility-history.dto';

@Injectable()
export class FeasibilityService {
  constructor(
    @InjectRepository(FeasibilityHistory)
    private readonly repo: Repository<FeasibilityHistory>,
  ) {}

  async findHistory(filter: FilterFeasibilityHistoryDto) {
    const { page = 1, limit = 10, search, resultType, status } = filter;

    const qb = this.repo.createQueryBuilder('fh');

    if (resultType) {
      qb.andWhere('fh.resultType = :resultType', { resultType });
    }

    if (status) {
      qb.andWhere('fh.status = :status', { status });
    }

    if (search) {
      qb.andWhere(
        '(fh.studyCode ILIKE :t OR fh.clientName ILIKE :t OR fh.productName ILIKE :t OR fh.resultCode ILIKE :t)',
        { t: `%${search}%` },
      );
    }

    qb.orderBy('fh.approvedDate', 'DESC');
    qb.skip((Number(page) - 1) * Number(limit)).take(Number(limit));

    const [data, total] = await qb.getManyAndCount();

    return { data, total, page: Number(page), limit: Number(limit) };
  }
}
