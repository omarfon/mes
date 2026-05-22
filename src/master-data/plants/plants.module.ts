import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plant } from './entities/plant.entity';
import { PlantsController } from './plants.controller';
import { PlantsService } from './plants.service';
import { AuditsModule } from '../../traceability/audits/audits.module';

@Module({
  imports: [TypeOrmModule.forFeature([Plant]), AuditsModule],
  controllers: [PlantsController],
  providers: [PlantsService],
  exports: [PlantsService, TypeOrmModule],
})
export class PlantsModule {}
