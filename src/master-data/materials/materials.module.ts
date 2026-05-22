import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Material } from './entities/material.entity';
import { MaterialsController } from './materials.controller';
import { MaterialsService } from './materials.service';

import { AuditsModule } from '../../traceability/audits/audits.module';

@Module({
  imports: [TypeOrmModule.forFeature([Material]), AuditsModule],
  controllers: [MaterialsController],
  providers: [MaterialsService],
  exports: [MaterialsService, TypeOrmModule],
})
export class MaterialsModule {}
