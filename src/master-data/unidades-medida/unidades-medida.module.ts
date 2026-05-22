import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnidadMedida } from './entities/unidad-medida.entity';
import { UnidadesMedidaController } from './unidades-medida.controller';
import { UnidadesMedidaService } from './unidades-medida.service';

import { AuditsModule } from '../../traceability/audits/audits.module';

@Module({
  imports: [TypeOrmModule.forFeature([UnidadMedida]), AuditsModule],
  controllers: [UnidadesMedidaController],
  providers: [UnidadesMedidaService],
  exports: [UnidadesMedidaService, TypeOrmModule],
})
export class UnidadesMedidaModule {}
