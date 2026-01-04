import { Injectable } from '@nestjs/common';
import { LotsService } from './lots/lots.service';
import { MovementsService } from './movements/movements.service';
import { GenealogyService } from './genealogy/genealogy.service';
import { SerialsService } from './serials/serials.service';
import { LocationsService } from './locations/locations.service';

@Injectable()
export class TraceabilityAggregatorService {
  constructor(
    private lotsService: LotsService,
    private movementsService: MovementsService,
    private genealogyService: GenealogyService,
    private serialsService: SerialsService,
    private locationsService: LocationsService,
  ) {}

  async getCompleteTraceability(lotId: string): Promise<any> {
    const lot = await this.lotsService.findOne(lotId);
    const movements = await this.movementsService.findByLotId(lotId);
    const genealogy = await this.genealogyService.findByLotId(lotId);
    const serials = await this.serialsService.findByLotId(lotId);

    // Obtener genealogía completa (upstream y downstream)
    const fullTree = await this.genealogyService.getFullTree(lotId);

    // Obtener ubicación actual
    const lastMovement = movements[0];
    let currentLocation: any = null;
    if (lastMovement?.toLocation) {
      currentLocation = await this.locationsService.findOne(lastMovement.toLocation);
    }

    return {
      lot,
      movements,
      genealogy: {
        relations: genealogy,
        fullTree,
      },
      serials,
      currentLocation,
      summary: {
        totalMovements: movements.length,
        totalSerials: serials.length,
        totalRelations: genealogy.length,
      },
    };
  }

  async traceBySerial(serialNumber: string): Promise<any> {
    const serial = await this.serialsService.findBySerialNumber(serialNumber);
    const lot = await this.lotsService.findOne(serial.lotId);
    const fullTraceability = await this.getCompleteTraceability(serial.lotId);

    return {
      serial,
      ...fullTraceability,
    };
  }

  async advancedSearch(criteria: {
    lotNumber?: string;
    serialNumber?: string;
    productId?: string;
    locationId?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<any> {
    const results: any = {
      lots: [],
      serials: [],
      movements: [],
    };

    if (criteria.lotNumber) {
      const lot = await this.lotsService.findByLotNumber(criteria.lotNumber);
      results.lots.push(lot);
    }

    if (criteria.serialNumber) {
      const serial = await this.serialsService.findBySerialNumber(criteria.serialNumber);
      results.serials.push(serial);
    }

    if (criteria.productId) {
      const lots = await this.lotsService.findAll({ productId: criteria.productId });
      results.lots.push(...lots);
    }

    if (criteria.locationId) {
      const movements = await this.movementsService.findByLotId(criteria.locationId);
      results.movements.push(...movements);
    }

    if (criteria.dateFrom && criteria.dateTo) {
      const movements = await this.movementsService.findByDateRange(
        criteria.dateFrom,
        criteria.dateTo,
      );
      results.movements.push(...movements);
    }

    return results;
  }
}
