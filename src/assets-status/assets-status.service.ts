import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssetStatus, AssetStatusEnum } from './entities/asset-status.entity';
import { CreateAssetStatusDto } from './dto/create-asset-status.dto';
import { UpdateAssetStatusDto } from './dto/update-asset-status.dto';
import { ChangeStatusDto } from './dto/change-status.dto';

@Injectable()
export class AssetsStatusService {
  constructor(
    @InjectRepository(AssetStatus)
    private readonly assetStatusRepository: Repository<AssetStatus>,
  ) {}

  async create(createDto: CreateAssetStatusDto): Promise<AssetStatus> {
    const assetStatus = this.assetStatusRepository.create({
      ...createDto,
      status: createDto.status || AssetStatusEnum.IDLE,
      statusChangedAt: new Date(),
      lastSeen: new Date(),
      isConnected: true,
    });

    return await this.assetStatusRepository.save(assetStatus);
  }

  async findAll(): Promise<AssetStatus[]> {
    return await this.assetStatusRepository.find({
      order: { assetCode: 'ASC' },
    });
  }

  async findOne(id: string): Promise<AssetStatus> {
    const assetStatus = await this.assetStatusRepository.findOne({
      where: { id },
    });

    if (!assetStatus) {
      throw new NotFoundException(`Asset status with ID ${id} not found`);
    }

    return assetStatus;
  }

  async findByAssetId(assetId: string): Promise<AssetStatus> {
    const assetStatus = await this.assetStatusRepository.findOne({
      where: { assetId },
    });

    if (!assetStatus) {
      throw new NotFoundException(`Asset status for asset ${assetId} not found`);
    }

    return assetStatus;
  }

  async update(
    id: string,
    updateDto: UpdateAssetStatusDto,
  ): Promise<AssetStatus> {
    const assetStatus = await this.findOne(id);

    Object.assign(assetStatus, updateDto);
    assetStatus.lastSeen = new Date();

    return await this.assetStatusRepository.save(assetStatus);
  }

  async changeStatus(
    id: string,
    changeStatusDto: ChangeStatusDto,
  ): Promise<AssetStatus> {
    const assetStatus = await this.findOne(id);

    assetStatus.previousStatus = assetStatus.status;
    assetStatus.status = changeStatusDto.status;
    assetStatus.statusChangedAt = new Date();
    assetStatus.timeInCurrentStatus = 0;
    assetStatus.lastSeen = new Date();

    return await this.assetStatusRepository.save(assetStatus);
  }

  async updateHeartbeat(id: string): Promise<AssetStatus> {
    const assetStatus = await this.findOne(id);

    const now = new Date();
    const secondsInStatus = Math.floor(
      (now.getTime() - assetStatus.statusChangedAt.getTime()) / 1000,
    );

    assetStatus.lastSeen = now;
    assetStatus.timeInCurrentStatus = secondsInStatus;
    assetStatus.isConnected = true;

    return await this.assetStatusRepository.save(assetStatus);
  }

  async remove(id: string): Promise<void> {
    const assetStatus = await this.findOne(id);
    await this.assetStatusRepository.remove(assetStatus);
  }
}
