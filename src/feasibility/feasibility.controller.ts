import { Controller, Get, Query } from '@nestjs/common';
import { FeasibilityService } from './feasibility.service';
import { FilterFeasibilityHistoryDto } from './dto/filter-feasibility-history.dto';

@Controller('feasibility')
export class FeasibilityController {
  constructor(private readonly svc: FeasibilityService) {}

  /**
   * GET /feasibility
   * Lista base de estudios (stub — devuelve array vacío hasta implementar la entidad completa)
   */
  @Get()
  findAll() {
    return [];
  }

  /**
   * GET /feasibility/history
   * Historial de estudios aprobados, paginados de 10 en 10.
   */
  @Get('history')
  findHistory(@Query() filter: FilterFeasibilityHistoryDto) {
    return this.svc.findHistory(filter);
  }
}
