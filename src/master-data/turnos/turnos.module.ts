import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Turno } from './entities/turno.entity';
import { TurnosController } from './turnos.controller';
import { TurnosService } from './turnos.service';

import { AuditsModule } from '../../traceability/audits/audits.module';

@Module({
  imports: [TypeOrmModule.forFeature([Turno]), AuditsModule],
  controllers: [TurnosController],
  providers: [TurnosService],
  exports: [TurnosService, TypeOrmModule],
})
export class TurnosModule {}
