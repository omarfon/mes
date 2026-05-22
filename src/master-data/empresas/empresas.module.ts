import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empresa } from './entities/empresa.entity';
import { EmpresasController } from './empresas.controller';
import { EmpresasService } from './empresas.service';

import { AuditsModule } from '../../traceability/audits/audits.module';

@Module({
  imports: [TypeOrmModule.forFeature([Empresa]), AuditsModule],
  controllers: [EmpresasController],
  providers: [EmpresasService],
  exports: [EmpresasService, TypeOrmModule],
})
export class EmpresasModule {}
