import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Area } from './entities/area.entity';
import { AreasController } from './areas.controller';
import { AreasService } from './areas.service';
import { AuditsModule } from '../../traceability/audits/audits.module';

@Module({
  imports: [TypeOrmModule.forFeature([Area]), AuditsModule],
  controllers: [AreasController],
  providers: [AreasService],
  exports: [AreasService, TypeOrmModule],
})
export class AreasModule {}
