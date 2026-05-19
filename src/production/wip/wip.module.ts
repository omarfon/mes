import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WIP } from './entities/wip.entity';
import { WIPService } from './wip.service';
import { WIPController } from './wip.controller';
import { WipGateway } from './wip.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([WIP])],
  controllers: [WIPController],
  providers: [WIPService, WipGateway],
  exports: [WIPService, TypeOrmModule],
})
export class WipModule {}