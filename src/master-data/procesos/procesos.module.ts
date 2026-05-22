import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proceso } from './entities/proceso.entity';
import { ProcesosController } from './procesos.controller';
import { ProcesosService } from './procesos.service';

import { AuditsModule } from '../../traceability/audits/audits.module';

@Module({
  imports: [TypeOrmModule.forFeature([Proceso]), AuditsModule],
  controllers: [ProcesosController],
  providers: [ProcesosService],
  exports: [ProcesosService, TypeOrmModule],
})
export class ProcesosModule {}
