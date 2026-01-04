// ejecucion.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ejecucion } from './entities/ejecucion.entity';
import { EjecucionService } from './ejecucion.service';
import { EjecucionController } from './ejecucion.controller';
import { MachinesModule } from '../../master-data/machines/machines.module';
import { OperadoresModule } from '../../master-data/operadores/operadores.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ejecucion]),
    MachinesModule,
    OperadoresModule,
  ],
  controllers: [EjecucionController],
  providers: [EjecucionService],
  exports: [EjecucionService, TypeOrmModule],
})
export class EjecucionModule {}