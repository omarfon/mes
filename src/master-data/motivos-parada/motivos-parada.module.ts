import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MotivoParada } from './entities/motivo-parada.entity';
import { MotivosParadaController } from './motivos-parada.controller';
import { MotivosParadaService } from './motivos-parada.service';

import { AuditsModule } from '../../traceability/audits/audits.module';

@Module({
  imports: [TypeOrmModule.forFeature([MotivoParada]), AuditsModule],
  controllers: [MotivosParadaController],
  providers: [MotivosParadaService],
  exports: [MotivosParadaService, TypeOrmModule],
})
export class MotivosParadaModule {}
