import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ControlTiempo } from './entities/control-tiempo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ControlTiempo])],
  exports: [TypeOrmModule],
})
export class ControlTiemposModule {}
