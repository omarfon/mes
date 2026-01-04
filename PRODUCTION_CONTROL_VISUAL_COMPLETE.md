# 🎛️ Production Control Visual - Implementación Completa

## 📋 Resumen

Este documento contiene la implementación completa del módulo **Production Control Visual** para el MES, incluyendo todos los sub-módulos necesarios para monitoreo y control en tiempo real tipo SCADA.

---

## 🏗️ Arquitectura del Sistema

```
Production Control Visual
├── Assets Status (estado en tiempo real)
├── WIP - Work In Progress (trabajo activo)
├── Maintenance Downtime (paros/tiempos muertos)
├── Maintenance Interventions (tickets rápidos)
├── IoT Telemetry (señales en vivo)
└── Control Visual Dashboard (agregador principal)
```

---

## 1️⃣ Assets Status Module

### Entity: `asset-status.entity.ts`

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum AssetStatusEnum {
  RUNNING = 'RUNNING',
  STOPPED = 'STOPPED',
  FAULT = 'FAULT',
  IDLE = 'IDLE',
  MAINTENANCE = 'MAINTENANCE',
}

@Entity('asset_status')
export class AssetStatus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'asset_id', unique: true })
  assetId: string;

  @Column({ name: 'asset_code', length: 50 })
  assetCode: string;

  @Column({ name: 'asset_name', length: 200 })
  assetName: string;

  @Column({
    type: 'enum',
    enum: AssetStatusEnum,
    default: AssetStatusEnum.IDLE,
  })
  status: AssetStatusEnum;

  @Column({ name: 'previous_status', type: 'varchar', nullable: true })
  previousStatus: string;

  @Column({ name: 'status_changed_at', type: 'timestamp' })
  statusChangedAt: Date;

  @Column({ name: 'time_in_current_status', type: 'int', default: 0 })
  timeInCurrentStatus: number; // seconds

  @Column({ name: 'last_seen', type: 'timestamp', nullable: true })
  lastSeen: Date;

  @Column({ name: 'is_connected', type: 'boolean', default: true })
  isConnected: boolean;

  @Column({ name: 'active_alarms', type: 'int', default: 0 })
  activeAlarms: number;

  @Column({ name: 'alarm_details', type: 'jsonb', nullable: true })
  alarmDetails: any;

  @Column({ name: 'current_work_order_id', type: 'uuid', nullable: true })
  currentWorkOrderId: string;

  @Column({ name: 'current_work_order_code', type: 'varchar', nullable: true })
  currentWorkOrderCode: string;

  @Column({ name: 'operator_id', type: 'uuid', nullable: true })
  operatorId: string;

  @Column({ name: 'operator_name', type: 'varchar', nullable: true })
  operatorName: string;

  @Column({ name: 'shift_id', type: 'uuid', nullable: true })
  shiftId: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

### Controller: `assets-status.controller.ts`

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AssetsStatusService } from './assets-status.service';
import { CreateAssetStatusDto } from './dto/create-asset-status.dto';
import { UpdateAssetStatusDto } from './dto/update-asset-status.dto';
import { ChangeStatusDto } from './dto/change-status.dto';

@ApiTags('Assets Status')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('assets-status')
export class AssetsStatusController {
  constructor(private readonly assetsStatusService: AssetsStatusService) {}

  @Post()
  create(@Body() createDto: CreateAssetStatusDto) {
    return this.assetsStatusService.create(createDto);
  }

  @Get()
  findAll() {
    return this.assetsStatusService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assetsStatusService.findOne(id);
  }

  @Get('asset/:assetId')
  findByAssetId(@Param('assetId') assetId: string) {
    return this.assetsStatusService.findByAssetId(assetId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateAssetStatusDto) {
    return this.assetsStatusService.update(id, updateDto);
  }

  @Patch(':id/status')
  changeStatus(@Param('id') id: string, @Body() changeStatusDto: ChangeStatusDto) {
    return this.assetsStatusService.changeStatus(id, changeStatusDto);
  }

  @Patch(':id/heartbeat')
  updateHeartbeat(@Param('id') id: string) {
    return this.assetsStatusService.updateHeartbeat(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assetsStatusService.remove(id);
  }
}
```

### Module: `assets-status.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetsStatusService } from './assets-status.service';
import { AssetsStatusController } from './assets-status.controller';
import { AssetStatus } from './entities/asset-status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AssetStatus])],
  controllers: [AssetsStatusController],
  providers: [AssetsStatusService],
  exports: [AssetsStatusService],
})
export class AssetsStatusModule {}
```

---

## 2️⃣ WIP (Work In Progress) Module

### Entity: `wip.entity.ts`

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum WipStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity('wip')
export class Wip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'asset_id' })
  assetId: string;

  @Column({ name: 'asset_code', length: 50 })
  assetCode: string;

  @Column({ type: 'uuid', name: 'work_order_id' })
  workOrderId: string;

  @Column({ name: 'work_order_code', length: 100 })
  workOrderCode: string;

  @Column({ name: 'lot_number', length: 100, nullable: true })
  lotNumber: string;

  @Column({ name: 'piece_number', length: 100, nullable: true })
  pieceNumber: string;

  @Column({ name: 'operation_id', type: 'uuid', nullable: true })
  operationId: string;

  @Column({ name: 'operation_name', length: 200, nullable: true })
  operationName: string;

  @Column({ name: 'station', length: 100, nullable: true })
  station: string;

  @Column({
    type: 'enum',
    enum: WipStatus,
    default: WipStatus.ACTIVE,
  })
  status: WipStatus;

  @Column({ name: 'quantity_planned', type: 'int' })
  quantityPlanned: number;

  @Column({ name: 'quantity_good', type: 'int', default: 0 })
  quantityGood: number;

  @Column({ name: 'quantity_scrap', type: 'int', default: 0 })
  quantityScrap: number;

  @Column({ name: 'quantity_in_progress', type: 'int', default: 0 })
  quantityInProgress: number;

  @Column({ name: 'current_cycle_time', type: 'int', nullable: true })
  currentCycleTime: number; // seconds

  @Column({ name: 'average_cycle_time', type: 'decimal', precision: 10, scale: 2, nullable: true })
  averageCycleTime: number;

  @Column({ name: 'target_cycle_time', type: 'int', nullable: true })
  targetCycleTime: number;

  @Column({ name: 'operator_id', type: 'uuid', nullable: true })
  operatorId: string;

  @Column({ name: 'operator_name', length: 200, nullable: true })
  operatorName: string;

  @Column({ name: 'started_at', type: 'timestamp' })
  startedAt: Date;

  @Column({ name: 'paused_at', type: 'timestamp', nullable: true })
  pausedAt: Date;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ name: 'total_pause_time', type: 'int', default: 0 })
  totalPauseTime: number; // seconds

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

### DTOs

```typescript
// create-wip.dto.ts
import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateWipDto {
  @IsUUID()
  @IsNotEmpty()
  assetId: string;

  @IsString()
  @IsNotEmpty()
  assetCode: string;

  @IsUUID()
  @IsNotEmpty()
  workOrderId: string;

  @IsString()
  @IsNotEmpty()
  workOrderCode: string;

  @IsString()
  @IsOptional()
  lotNumber?: string;

  @IsString()
  @IsOptional()
  pieceNumber?: string;

  @IsUUID()
  @IsOptional()
  operationId?: string;

  @IsString()
  @IsOptional()
  operationName?: string;

  @IsString()
  @IsOptional()
  station?: string;

  @IsInt()
  @Min(1)
  quantityPlanned: number;

  @IsInt()
  @IsOptional()
  targetCycleTime?: number;

  @IsUUID()
  @IsOptional()
  operatorId?: string;

  @IsString()
  @IsOptional()
  operatorName?: string;

  @IsOptional()
  metadata?: any;
}

// register-production.dto.ts
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class RegisterProductionDto {
  @IsInt()
  @Min(0)
  @IsOptional()
  quantityGood?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  quantityScrap?: number;

  @IsString()
  @IsOptional()
  scrapReason?: string;

  @IsInt()
  @IsOptional()
  cycleTime?: number;

  @IsOptional()
  metadata?: any;
}
```

### Service: `wip.service.ts`

```typescript
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wip, WipStatus } from './entities/wip.entity';
import { CreateWipDto } from './dto/create-wip.dto';
import { RegisterProductionDto } from './dto/register-production.dto';

@Injectable()
export class WipService {
  constructor(
    @InjectRepository(Wip)
    private readonly wipRepository: Repository<Wip>,
  ) {}

  async create(createDto: CreateWipDto): Promise<Wip> {
    // Check if asset already has active WIP
    const activeWip = await this.wipRepository.findOne({
      where: {
        assetId: createDto.assetId,
        status: WipStatus.ACTIVE,
      },
    });

    if (activeWip) {
      throw new BadRequestException(
        `Asset ${createDto.assetCode} already has an active WIP`,
      );
    }

    const wip = this.wipRepository.create({
      ...createDto,
      status: WipStatus.ACTIVE,
      startedAt: new Date(),
    });

    return await this.wipRepository.save(wip);
  }

  async findActiveByAssetId(assetId: string): Promise<Wip | null> {
    return await this.wipRepository.findOne({
      where: {
        assetId,
        status: WipStatus.ACTIVE,
      },
    });
  }

  async findOne(id: string): Promise<Wip> {
    const wip = await this.wipRepository.findOne({ where: { id } });

    if (!wip) {
      throw new NotFoundException(`WIP with ID ${id} not found`);
    }

    return wip;
  }

  async pause(id: string): Promise<Wip> {
    const wip = await this.findOne(id);

    if (wip.status !== WipStatus.ACTIVE) {
      throw new BadRequestException('Only active WIP can be paused');
    }

    wip.status = WipStatus.PAUSED;
    wip.pausedAt = new Date();

    return await this.wipRepository.save(wip);
  }

  async resume(id: string): Promise<Wip> {
    const wip = await this.findOne(id);

    if (wip.status !== WipStatus.PAUSED) {
      throw new BadRequestException('Only paused WIP can be resumed');
    }

    if (wip.pausedAt) {
      const pauseDuration = Math.floor(
        (Date.now() - wip.pausedAt.getTime()) / 1000,
      );
      wip.totalPauseTime += pauseDuration;
    }

    wip.status = WipStatus.ACTIVE;
    wip.pausedAt = null;

    return await this.wipRepository.save(wip);
  }

  async registerProduction(
    id: string,
    registerDto: RegisterProductionDto,
  ): Promise<Wip> {
    const wip = await this.findOne(id);

    if (registerDto.quantityGood !== undefined) {
      wip.quantityGood += registerDto.quantityGood;
    }

    if (registerDto.quantityScrap !== undefined) {
      wip.quantityScrap += registerDto.quantityScrap;
    }

    if (registerDto.cycleTime !== undefined) {
      wip.currentCycleTime = registerDto.cycleTime;

      // Calculate average
      const totalProduced = wip.quantityGood + wip.quantityScrap;
      if (totalProduced > 0 && wip.averageCycleTime) {
        wip.averageCycleTime =
          (wip.averageCycleTime * (totalProduced - 1) + registerDto.cycleTime) /
          totalProduced;
      } else {
        wip.averageCycleTime = registerDto.cycleTime;
      }
    }

    if (registerDto.metadata) {
      wip.metadata = { ...wip.metadata, ...registerDto.metadata };
    }

    return await this.wipRepository.save(wip);
  }

  async complete(id: string): Promise<Wip> {
    const wip = await this.findOne(id);

    if (wip.status === WipStatus.COMPLETED) {
      throw new BadRequestException('WIP already completed');
    }

    wip.status = WipStatus.COMPLETED;
    wip.completedAt = new Date();

    return await this.wipRepository.save(wip);
  }

  async cancel(id: string): Promise<Wip> {
    const wip = await this.findOne(id);

    wip.status = WipStatus.CANCELLED;
    wip.completedAt = new Date();

    return await this.wipRepository.save(wip);
  }
}
```

### Controller: `wip.controller.ts`

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WipService } from './wip.service';
import { CreateWipDto } from './dto/create-wip.dto';
import { RegisterProductionDto } from './dto/register-production.dto';

@ApiTags('WIP')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wip')
export class WipController {
  constructor(private readonly wipService: WipService) {}

  @Post('start')
  create(@Body() createDto: CreateWipDto) {
    return this.wipService.create(createDto);
  }

  @Get('active/:assetId')
  findActiveByAssetId(@Param('assetId') assetId: string) {
    return this.wipService.findActiveByAssetId(assetId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wipService.findOne(id);
  }

  @Patch(':id/pause')
  pause(@Param('id') id: string) {
    return this.wipService.pause(id);
  }

  @Patch(':id/resume')
  resume(@Param('id') id: string) {
    return this.wipService.resume(id);
  }

  @Patch(':id/register-production')
  registerProduction(
    @Param('id') id: string,
    @Body() registerDto: RegisterProductionDto,
  ) {
    return this.wipService.registerProduction(id, registerDto);
  }

  @Post(':id/complete')
  complete(@Param('id') id: string) {
    return this.wipService.complete(id);
  }

  @Post(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.wipService.cancel(id);
  }
}
```

---

## 3️⃣ Maintenance Downtime Module

### Entity: `maintenance-downtime.entity.ts`

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('maintenance_downtime')
export class MaintenanceDowntime {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'asset_id' })
  assetId: string;

  @Column({ name: 'asset_code', length: 50 })
  assetCode: string;

  @Column({ name: 'reason_code', length: 50 })
  reasonCode: string;

  @Column({ name: 'reason_description', length: 500 })
  reasonDescription: string;

  @Column({ name: 'category', length: 50, nullable: true })
  category: string; // PLANNED, UNPLANNED, BREAKDOWN, etc.

  @Column({ name: 'started_at', type: 'timestamp' })
  startedAt: Date;

  @Column({ name: 'ended_at', type: 'timestamp', nullable: true })
  endedAt: Date;

  @Column({ name: 'duration_seconds', type: 'int', nullable: true })
  durationSeconds: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'reported_by_id', type: 'uuid', nullable: true })
  reportedById: string;

  @Column({ name: 'reported_by_name', length: 200, nullable: true })
  reportedByName: string;

  @Column({ name: 'resolved_by_id', type: 'uuid', nullable: true })
  resolvedById: string;

  @Column({ name: 'resolved_by_name', length: 200, nullable: true })
  resolvedByName: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

### DTOs

```typescript
// start-downtime.dto.ts
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class StartDowntimeDto {
  @IsUUID()
  @IsNotEmpty()
  assetId: string;

  @IsString()
  @IsNotEmpty()
  assetCode: string;

  @IsString()
  @IsNotEmpty()
  reasonCode: string;

  @IsString()
  @IsNotEmpty()
  reasonDescription: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsUUID()
  @IsOptional()
  reportedById?: string;

  @IsString()
  @IsOptional()
  reportedByName?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsOptional()
  metadata?: any;
}

// end-downtime.dto.ts
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class EndDowntimeDto {
  @IsUUID()
  @IsOptional()
  resolvedById?: string;

  @IsString()
  @IsOptional()
  resolvedByName?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
```

### Service: `maintenance-downtime.service.ts`

```typescript
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { MaintenanceDowntime } from './entities/maintenance-downtime.entity';
import { StartDowntimeDto } from './dto/start-downtime.dto';
import { EndDowntimeDto } from './dto/end-downtime.dto';

@Injectable()
export class MaintenanceDowntimeService {
  constructor(
    @InjectRepository(MaintenanceDowntime)
    private readonly downtimeRepository: Repository<MaintenanceDowntime>,
  ) {}

  async start(startDto: StartDowntimeDto): Promise<MaintenanceDowntime> {
    // Check if asset already has active downtime
    const activeDowntime = await this.downtimeRepository.findOne({
      where: {
        assetId: startDto.assetId,
        isActive: true,
        endedAt: IsNull(),
      },
    });

    if (activeDowntime) {
      throw new BadRequestException(
        `Asset ${startDto.assetCode} already has an active downtime`,
      );
    }

    const downtime = this.downtimeRepository.create({
      ...startDto,
      startedAt: new Date(),
      isActive: true,
    });

    return await this.downtimeRepository.save(downtime);
  }

  async end(id: string, endDto: EndDowntimeDto): Promise<MaintenanceDowntime> {
    const downtime = await this.downtimeRepository.findOne({ where: { id } });

    if (!downtime) {
      throw new NotFoundException(`Downtime with ID ${id} not found`);
    }

    if (!downtime.isActive || downtime.endedAt) {
      throw new BadRequestException('Downtime already ended');
    }

    const now = new Date();
    downtime.endedAt = now;
    downtime.durationSeconds = Math.floor(
      (now.getTime() - downtime.startedAt.getTime()) / 1000,
    );
    downtime.isActive = false;
    downtime.resolvedById = endDto.resolvedById;
    downtime.resolvedByName = endDto.resolvedByName;

    if (endDto.notes) {
      downtime.notes = downtime.notes
        ? `${downtime.notes}\n\n${endDto.notes}`
        : endDto.notes;
    }

    return await this.downtimeRepository.save(downtime);
  }

  async findActiveByAssetId(assetId: string): Promise<MaintenanceDowntime | null> {
    return await this.downtimeRepository.findOne({
      where: {
        assetId,
        isActive: true,
        endedAt: IsNull(),
      },
    });
  }

  async findByAssetId(
    assetId: string,
    limit: number = 50,
  ): Promise<MaintenanceDowntime[]> {
    return await this.downtimeRepository.find({
      where: { assetId },
      order: { startedAt: 'DESC' },
      take: limit,
    });
  }

  async getTopReasons(assetId: string, days: number = 7): Promise<any[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const results = await this.downtimeRepository
      .createQueryBuilder('downtime')
      .select('downtime.reasonCode', 'reasonCode')
      .addSelect('downtime.reasonDescription', 'reasonDescription')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(downtime.durationSeconds)', 'totalDuration')
      .where('downtime.assetId = :assetId', { assetId })
      .andWhere('downtime.startedAt >= :startDate', { startDate })
      .groupBy('downtime.reasonCode')
      .addGroupBy('downtime.reasonDescription')
      .orderBy('totalDuration', 'DESC')
      .limit(10)
      .getRawMany();

    return results;
  }
}
```

---

## 4️⃣ IoT Telemetry Module

### Entity: `iot-telemetry.entity.ts`

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export enum TelemetryQuality {
  GOOD = 'GOOD',
  UNCERTAIN = 'UNCERTAIN',
  BAD = 'BAD',
  STALE = 'STALE',
}

@Entity('iot_telemetry')
@Index(['assetId', 'variableName', 'timestamp'])
export class IotTelemetry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'asset_id' })
  assetId: string;

  @Column({ name: 'variable_name', length: 100 })
  variableName: string;

  @Column({ name: 'variable_label', length: 200, nullable: true })
  variableLabel: string;

  @Column({ name: 'value', type: 'decimal', precision: 15, scale: 4 })
  value: number;

  @Column({ name: 'unit', length: 20, nullable: true })
  unit: string;

  @Column({
    type: 'enum',
    enum: TelemetryQuality,
    default: TelemetryQuality.GOOD,
  })
  quality: TelemetryQuality;

  @Column({ type: 'timestamp' })
  timestamp: Date;

  @Column({ name: 'min_threshold', type: 'decimal', precision: 15, scale: 4, nullable: true })
  minThreshold: number;

  @Column({ name: 'max_threshold', type: 'decimal', precision: 15, scale: 4, nullable: true })
  maxThreshold: number;

  @Column({ name: 'is_alarm', type: 'boolean', default: false })
  isAlarm: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
```

### Service: `iot-telemetry.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { IotTelemetry, TelemetryQuality } from './entities/iot-telemetry.entity';

@Injectable()
export class IotTelemetryService {
  constructor(
    @InjectRepository(IotTelemetry)
    private readonly telemetryRepository: Repository<IotTelemetry>,
  ) {}

  async getLatestByAssetId(assetId: string): Promise<any[]> {
    // Get latest value for each variable
    const subQuery = this.telemetryRepository
      .createQueryBuilder('t')
      .select('t.variableName', 'variableName')
      .addSelect('MAX(t.timestamp)', 'maxTimestamp')
      .where('t.assetId = :assetId', { assetId })
      .groupBy('t.variableName');

    const result = await this.telemetryRepository
      .createQueryBuilder('telemetry')
      .innerJoin(
        `(${subQuery.getQuery()})`,
        'latest',
        'telemetry.variableName = latest.variableName AND telemetry.timestamp = latest.maxTimestamp',
      )
      .where('telemetry.assetId = :assetId', { assetId })
      .setParameters(subQuery.getParameters())
      .orderBy('telemetry.variableName', 'ASC')
      .getMany();

    return result;
  }

  async getTrend(
    assetId: string,
    variableName: string,
    minutes: number = 15,
  ): Promise<IotTelemetry[]> {
    const startTime = new Date();
    startTime.setMinutes(startTime.getMinutes() - minutes);

    return await this.telemetryRepository.find({
      where: {
        assetId,
        variableName,
        timestamp: MoreThan(startTime),
      },
      order: { timestamp: 'ASC' },
    });
  }

  async insert(data: Partial<IotTelemetry>): Promise<IotTelemetry> {
    const telemetry = this.telemetryRepository.create({
      ...data,
      timestamp: data.timestamp || new Date(),
    });

    // Check thresholds
    if (data.minThreshold !== undefined || data.maxThreshold !== undefined) {
      if (
        (data.minThreshold && data.value < data.minThreshold) ||
        (data.maxThreshold && data.value > data.maxThreshold)
      ) {
        telemetry.isAlarm = true;
        telemetry.quality = TelemetryQuality.BAD;
      }
    }

    return await this.telemetryRepository.save(telemetry);
  }
}
```

---

## 5️⃣ Production Control Visual Module (Agregador Principal)

### Service: `production-control-visual.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { AssetsStatusService } from '../assets-status/assets-status.service';
import { WipService } from '../wip/wip.service';
import { MaintenanceDowntimeService } from '../maintenance-downtime/maintenance-downtime.service';
import { IotTelemetryService } from '../iot-telemetry/iot-telemetry.service';

@Injectable()
export class ProductionControlVisualService {
  constructor(
    private readonly assetsStatusService: AssetsStatusService,
    private readonly wipService: WipService,
    private readonly downtimeService: MaintenanceDowntimeService,
    private readonly telemetryService: IotTelemetryService,
  ) {}

  async getAssetControlData(assetId: string): Promise<any> {
    // Get asset status
    const assetStatus = await this.assetsStatusService.findByAssetId(assetId);

    // Get active WIP
    const activeWip = await this.wipService.findActiveByAssetId(assetId);

    // Get active downtime
    const activeDowntime = await this.downtimeService.findActiveByAssetId(assetId);

    // Get latest telemetry
    const telemetry = await this.telemetryService.getLatestByAssetId(assetId);

    // Get downtime history (last 50)
    const downtimeHistory = await this.downtimeService.findByAssetId(assetId, 50);

    // Get top downtime reasons (last 7 days)
    const topDowntimeReasons = await this.downtimeService.getTopReasons(assetId, 7);

    return {
      assetStatus,
      activeWip,
      activeDowntime,
      telemetry,
      downtimeHistory,
      topDowntimeReasons,
    };
  }

  async getAllAssetsOverview(): Promise<any[]> {
    const allAssets = await this.assetsStatusService.findAll();

    const overview = await Promise.all(
      allAssets.map(async (asset) => {
        const activeWip = await this.wipService.findActiveByAssetId(asset.assetId);
        const activeDowntime = await this.downtimeService.findActiveByAssetId(
          asset.assetId,
        );

        return {
          asset,
          hasActiveWip: !!activeWip,
          hasActiveDowntime: !!activeDowntime,
        };
      }),
    );

    return overview;
  }
}
```

### Controller: `production-control-visual.controller.ts`

```typescript
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProductionControlVisualService } from './production-control-visual.service';

@ApiTags('Production Control Visual')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('production-control-visual')
export class ProductionControlVisualController {
  constructor(
    private readonly controlVisualService: ProductionControlVisualService,
  ) {}

  @Get('asset/:assetId')
  getAssetControlData(@Param('assetId') assetId: string) {
    return this.controlVisualService.getAssetControlData(assetId);
  }

  @Get('overview')
  getAllAssetsOverview() {
    return this.controlVisualService.getAllAssetsOverview();
  }
}
```

### Module: `production-control-visual.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { ProductionControlVisualService } from './production-control-visual.service';
import { ProductionControlVisualController } from './production-control-visual.controller';
import { AssetsStatusModule } from '../assets-status/assets-status.module';
import { WipModule } from '../wip/wip.module';
import { MaintenanceDowntimeModule } from '../maintenance-downtime/maintenance-downtime.module';
import { IotTelemetryModule } from '../iot-telemetry/iot-telemetry.module';

@Module({
  imports: [
    AssetsStatusModule,
    WipModule,
    MaintenanceDowntimeModule,
    IotTelemetryModule,
  ],
  controllers: [ProductionControlVisualController],
  providers: [ProductionControlVisualService],
  exports: [ProductionControlVisualService],
})
export class ProductionControlVisualModule {}
```

---

## 📡 API Endpoints

### Assets Status
- `GET /assets-status` - Listar todos los estados de assets
- `GET /assets-status/:id` - Obtener estado por ID
- `GET /assets-status/asset/:assetId` - Obtener estado por asset ID
- `POST /assets-status` - Crear registro de estado
- `PATCH /assets-status/:id` - Actualizar estado
- `PATCH /assets-status/:id/status` - Cambiar estado
- `PATCH /assets-status/:id/heartbeat` - Actualizar heartbeat
- `DELETE /assets-status/:id` - Eliminar

### WIP (Work In Progress)
- `POST /wip/start` - Iniciar WIP
- `GET /wip/active/:assetId` - Obtener WIP activo por asset
- `GET /wip/:id` - Obtener WIP por ID
- `PATCH /wip/:id/pause` - Pausar WIP
- `PATCH /wip/:id/resume` - Reanudar WIP
- `PATCH /wip/:id/register-production` - Registrar producción (buenas/scrap)
- `POST /wip/:id/complete` - Completar WIP
- `POST /wip/:id/cancel` - Cancelar WIP

### Maintenance Downtime
- `POST /maintenance-downtime/start` - Iniciar downtime
- `POST /maintenance-downtime/:id/end` - Finalizar downtime
- `GET /maintenance-downtime/active/:assetId` - Obtener downtime activo
- `GET /maintenance-downtime/history/:assetId?limit=50` - Historial
- `GET /maintenance-downtime/top-reasons/:assetId?days=7` - Top razones

### IoT Telemetry
- `GET /iot-telemetry/latest/:assetId` - Últimas señales
- `GET /iot-telemetry/trend/:assetId/:variable?minutes=15` - Tendencia
- `POST /iot-telemetry` - Insertar dato de telemetría

### Production Control Visual (Agregador)
- `GET /production-control-visual/asset/:assetId` - **Pantalla principal**
- `GET /production-control-visual/overview` - Vista general de todos los assets

---

## 🎨 Estructura de Respuesta - Pantalla Principal

```typescript
GET /production-control-visual/asset/:assetId

Response:
{
  "assetStatus": {
    "id": "uuid",
    "assetId": "uuid",
    "assetCode": "M-001",
    "assetName": "Fresadora CNC 1",
    "status": "RUNNING",
    "previousStatus": "IDLE",
    "statusChangedAt": "2026-01-01T00:00:00Z",
    "timeInCurrentStatus": 3600,
    "lastSeen": "2026-01-01T01:00:00Z",
    "isConnected": true,
    "activeAlarms": 2,
    "alarmDetails": [
      { "code": "TEMP_HIGH", "message": "Temperatura alta" }
    ],
    "operatorName": "Juan Pérez"
  },
  "activeWip": {
    "id": "uuid",
    "workOrderCode": "OP-0001",
    "lotNumber": "L-2026-001",
    "operationName": "Fresado",
    "status": "ACTIVE",
    "quantityPlanned": 1000,
    "quantityGood": 850,
    "quantityScrap": 10,
    "currentCycleTime": 45,
    "averageCycleTime": 48.5,
    "targetCycleTime": 50
  },
  "activeDowntime": null,
  "telemetry": [
    {
      "variableName": "temperature",
      "variableLabel": "Temperatura",
      "value": 75.5,
      "unit": "°C",
      "quality": "GOOD",
      "timestamp": "2026-01-01T01:00:00Z",
      "minThreshold": 20,
      "maxThreshold": 80,
      "isAlarm": false
    },
    {
      "variableName": "rpm",
      "variableLabel": "RPM",
      "value": 2500,
      "unit": "rpm",
      "quality": "GOOD",
      "timestamp": "2026-01-01T01:00:00Z"
    }
  ],
  "downtimeHistory": [
    {
      "id": "uuid",
      "reasonCode": "BREAKDOWN",
      "reasonDescription": "Fallo en rodamiento",
      "startedAt": "2026-01-01T00:00:00Z",
      "endedAt": "2026-01-01T00:30:00Z",
      "durationSeconds": 1800,
      "resolvedByName": "Mantenimiento"
    }
  ],
  "topDowntimeReasons": [
    {
      "reasonCode": "BREAKDOWN",
      "reasonDescription": "Fallo en rodamiento",
      "count": 3,
      "totalDuration": 5400
    }
  ]
}
```

---

## 🚀 Comandos para Generar Módulos

```bash
# Assets Status
nest g resource assets-status --no-spec

# WIP
nest g resource wip --no-spec

# Maintenance Downtime
nest g resource maintenance-downtime --no-spec

# Maintenance Interventions
nest g resource maintenance-interventions --no-spec

# IoT Telemetry
nest g resource iot-telemetry --no-spec

# Production Control Visual
nest g module production-control-visual
nest g service production-control-visual --no-spec
nest g controller production-control-visual --no-spec
```

---

## ✅ Checklist de Implementación

- [ ] Crear módulo Assets Status
- [ ] Crear módulo WIP
- [ ] Crear módulo Maintenance Downtime
- [ ] Crear módulo Maintenance Interventions (tickets rápidos)
- [ ] Crear módulo IoT Telemetry
- [ ] Crear módulo Production Control Visual (agregador)
- [ ] Configurar relaciones en AppModule
- [ ] Generar y ejecutar migraciones
- [ ] Probar endpoints con Postman/Swagger
- [ ] Crear servicios Angular frontend
- [ ] Implementar pantalla Control Visual en frontend

---

## 📝 Notas Importantes

1. **Tiempo Real**: Considera implementar WebSockets para actualizaciones en tiempo real
2. **Permisos**: Implementar roles (operador, supervisor, admin) para acciones
3. **Historial**: Los eventos se guardan automáticamente para auditoría
4. **Alarms**: El sistema detecta alarmas basado en thresholds en telemetría
5. **Escalabilidad**: Considera TimescaleDB para telemetría de alto volumen

¿Quieres que implemente alguno de estos módulos en particular o prefieres que cree todos a la vez?
