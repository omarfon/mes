import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetStatus } from './entities/asset-status.entity';
import { AssetsStatusService } from './assets-status.service';
import { AssetsStatusController } from './assets-status.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AssetStatus])],
  controllers: [AssetsStatusController],
  providers: [AssetsStatusService],
  exports: [AssetsStatusService, TypeOrmModule],
})
export class AssetsStatusModule {}