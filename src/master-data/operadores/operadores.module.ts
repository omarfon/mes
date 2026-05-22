import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Operador } from './entities/operador.entity';
import { OperadoresController } from './operadores.controller';
import { OperadoresService } from './operadores.service';

import { AuditsModule } from '../../traceability/audits/audits.module';

@Module({
  imports: [TypeOrmModule.forFeature([Operador]), AuditsModule],
  controllers: [OperadoresController],
  providers: [OperadoresService],
  exports: [OperadoresService, TypeOrmModule],
})
export class OperadoresModule {}
