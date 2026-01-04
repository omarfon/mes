// src/traceability/movements/movements.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, Or, Between } from 'typeorm';
import { LotMovement, MovementType } from './entities/lot-movement.entity'; // Assuming CreateLotMovementDto is in this file
import { CreateLotMovementDto } from './dto/create-lot-movements.dto';

import { FilterMovementDto } from './dto/filter-lot-movements.dto';
import { LotsService } from '../lots/lots.service';

@Injectable()
export class MovementsService {
  constructor(
    @InjectRepository(LotMovement)
    private readonly movementRepository: Repository<LotMovement>,
    private readonly lotsService: LotsService,
  ) {}

  async create(createDto: CreateLotMovementDto): Promise<LotMovement> {
    // Buscar el lote por código
    let lot;
    try {
      lot = await this.lotsService.findByLotNumber(createDto.lotCode);
    } catch (error) {
      throw new BadRequestException(`Lote ${createDto.lotCode} no encontrado`);
    }

    // Crear el movimiento
    const movement = this.movementRepository.create({
      ...createDto,
      lotId: lot.id,
      fromLocation: lot.locationCode || createDto.fromLocation,      
      at: new Date(),
    });

    const saved = await this.movementRepository.save(movement);

    // Aplicar el movimiento al lote según el tipo
    await this.applyMovementToLot(lot.id, createDto);

    return saved;
  }

private async applyMovementToLot(lotId: string, movement: CreateLotMovementDto) {
  const lot = await this.lotsService.findOne(lotId);

  switch (movement.type) {
    case MovementType.TRANSFER:
      // Solo cambia ubicación, no cantidad
      if (movement.toLocation) {
        await this.lotsService.update(lotId, {
          locationId: movement.toLocation,
      });
      }
      break;

    case MovementType.CONSUME:
    case MovementType.SCRAP:
      // Reduce cantidad
      const newQuantity = Number(lot.quantityCurrent) - Number(movement.qty);
      if (newQuantity < 0) {
        throw new BadRequestException('Cantidad insuficiente en el lote');
      }
      await this.lotsService.updateQuantity(lotId, newQuantity);
      break;

    case MovementType.ADJUST:
      // Ajusta cantidad (puede ser + o -)
      // El DTO de movimiento ya tiene la cantidad final para el ajuste
      // No se usa newQuantity aquí, se usa movement.qty directamente como la nueva cantidad del lote
      await this.lotsService.updateQuantity(lotId, Number(movement.qty));
      break;

    case MovementType.RECEIPT:
    case MovementType.PRODUCTION:
      // Incrementa cantidad
      const increased = Number(lot.quantityCurrent) + Number(movement.qty);
      await this.lotsService.updateQuantity(lotId, increased);
      break;
  }
}

  async findAll(filter: FilterMovementDto) {
    const {
      page = 1,
      limit = 20,
      q,
      type,
      lotCode,
      location,
      orderCode,
    } = filter;

    const queryBuilder = this.movementRepository
      .createQueryBuilder('movement')
      .leftJoinAndSelect('movement.lot', 'lot');

    if (q) {
      queryBuilder.andWhere(
        '(movement.lotCode ILIKE :q OR movement.by ILIKE :q OR movement.reason ILIKE :q OR movement.note ILIKE :q OR movement.orderCode ILIKE :q OR movement.operation ILIKE :q OR movement.machineCode ILIKE :q)',
        { q: `%${q}%` }
      );
    }

    if (type) {
      queryBuilder.andWhere('movement.type = :type', { type });
    }

    if (lotCode) {
      queryBuilder.andWhere('movement.lotCode = :lotCode', { lotCode });
    }

    if (location) {
      queryBuilder.andWhere(
        '(movement.fromLocation ILIKE :location OR movement.toLocation ILIKE :location)',
        { location: `%${location}%` }
      );
    }

    if (orderCode) {
      queryBuilder.andWhere('movement.orderCode = :orderCode', { orderCode });
    }

    const [data, total] = await queryBuilder
      .take(limit)
      .skip((page - 1) * limit)
      .orderBy('movement.at', 'DESC')
      .getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByLotId(lotId: string): Promise<LotMovement[]> {
    return await this.movementRepository.find({
      where: { lotId },
      relations: ['lot'],
      order: { at: 'DESC' },
    });
  }

  async findByLotCode(lotCode: string): Promise<LotMovement[]> {
    return await this.movementRepository.find({
      where: { lotCode },
      relations: ['lot'],
      order: { at: 'DESC' },
    });
  }

  async findByDateRange(dateFrom: Date, dateTo: Date): Promise<LotMovement[]> {
    return await this.movementRepository.find({
      where: {
        at: Between(dateFrom, dateTo),
      },
      relations: ['lot'],
      order: { at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<LotMovement> {
    const movement = await this.movementRepository.findOne({ 
      where: { id },
      relations: ['lot'],
    });
    
    if (!movement) {
      throw new NotFoundException(`Movimiento con ID ${id} no encontrado`);
    }
    
    return movement;
  }
}