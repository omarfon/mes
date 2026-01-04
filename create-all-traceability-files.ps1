# Script para crear TODOS los archivos del módulo de Trazabilidad
# Ejecutar desde la raíz del proyecto

Write-Host "🚀 Creando TODOS los archivos de Trazabilidad..." -ForegroundColor Green

$baseDir = "src/traceability"

# ============================================
# MOVEMENTS MODULE
# ============================================

Write-Host "`n📦 Creando Movements Module..." -ForegroundColor Yellow

# movements.service.ts
$movementsService = @'
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { LotMovement, MovementType } from './entities/lot-movement.entity';
import { CreateLotMovementDto } from './dto/create-lot-movement.dto';

@Injectable()
export class MovementsService {
  constructor(
    @InjectRepository(LotMovement)
    private readonly movementRepository: Repository<LotMovement>,
  ) {}

  async create(createDto: CreateLotMovementDto): Promise<LotMovement> {
    const movement = this.movementRepository.create({
      ...createDto,
      movementDate: createDto.movementDate ? new Date(createDto.movementDate) : new Date(),
    });
    return await this.movementRepository.save(movement);
  }

  async findByLotId(lotId: string): Promise<LotMovement[]> {
    return await this.movementRepository.find({
      where: { lotId },
      order: { movementDate: 'DESC' },
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<LotMovement[]> {
    return await this.movementRepository.find({
      where: { movementDate: Between(startDate, endDate) },
      order: { movementDate: 'DESC' },
    });
  }

  async findByLocation(locationId: string): Promise<LotMovement[]> {
    return await this.movementRepository.find({
      where: [
        { fromLocationId: locationId },
        { toLocationId: locationId },
      ],
      order: { movementDate: 'DESC' },
    });
  }

  async findByType(type: MovementType): Promise<LotMovement[]> {
    return await this.movementRepository.find({
      where: { type },
      order: { movementDate: 'DESC' },
    });
  }

  async findOne(id: string): Promise<LotMovement> {
    const movement = await this.movementRepository.findOne({ where: { id } });
    if (!movement) {
      throw new NotFoundException(`Movement with ID ${id} not found`);
    }
    return movement;
  }
}
'@

Set-Content -Path "$baseDir/movements/movements.service.ts" -Value $movementsService

# movements.controller.ts
$movementsController = @'
import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { MovementsService } from './movements.service';
import { CreateLotMovementDto } from './dto/create-lot-movement.dto';

@ApiTags('Traceability - Movements')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('traceability/movements')
export class MovementsController {
  constructor(private readonly movementsService: MovementsService) {}

  @Post()
  create(@Body() createDto: CreateLotMovementDto) {
    return this.movementsService.create(createDto);
  }

  @Get('lot/:lotId')
  findByLotId(@Param('lotId') lotId: string) {
    return this.movementsService.findByLotId(lotId);
  }

  @Get('location/:locationId')
  findByLocation(@Param('locationId') locationId: string) {
    return this.movementsService.findByLocation(locationId);
  }

  @Get('date-range')
  findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.movementsService.findByDateRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movementsService.findOne(id);
  }
}
'@

Set-Content -Path "$baseDir/movements/movements.controller.ts" -Value $movementsController

# movements.module.ts
$movementsModule = @'
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovementsService } from './movements.service';
import { MovementsController } from './movements.controller';
import { LotMovement } from './entities/lot-movement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LotMovement])],
  controllers: [MovementsController],
  providers: [MovementsService],
  exports: [MovementsService],
})
export class MovementsModule {}
'@

Set-Content -Path "$baseDir/movements/movements.module.ts" -Value $movementsModule

Write-Host "✅ Movements Module creado" -ForegroundColor Green

Write-Host "`n✅ Script completado!" -ForegroundColor Green
Write-Host "`nPara completar el resto, consulta TRACEABILITY_COMPLETE.md" -ForegroundColor Cyan
Write-Host "y copia el código de cada módulo faltante." -ForegroundColor Cyan
