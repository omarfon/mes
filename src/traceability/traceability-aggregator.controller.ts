import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TraceabilityAggregatorService } from './traceability-aggregator.service';

@ApiTags('Traceability - Aggregator')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('traceability')
export class TraceabilityAggregatorController {
  constructor(private readonly aggregatorService: TraceabilityAggregatorService) {}

  @Get('lot/:lotId/complete')
  getCompleteTraceability(@Param('lotId') lotId: string) {
    return this.aggregatorService.getCompleteTraceability(lotId);
  }

  @Get('serial/:serialNumber/trace')
  traceBySerial(@Param('serialNumber') serialNumber: string) {
    return this.aggregatorService.traceBySerial(serialNumber);
  }

  @Get('search')
  advancedSearch(
    @Query('lotNumber') lotNumber?: string,
    @Query('serialNumber') serialNumber?: string,
    @Query('productId') productId?: string,
    @Query('locationId') locationId?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.aggregatorService.advancedSearch({
      lotNumber,
      serialNumber,
      productId,
      locationId,
      dateFrom: dateFrom ? new Date(dateFrom) : undefined,
      dateTo: dateTo ? new Date(dateTo) : undefined,
    });
  }
}
