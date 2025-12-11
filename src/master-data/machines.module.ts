import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Machine } from './machines/entities/machines.entity';
import { WorkCenter } from './machines/entities/work-center.entity';
import { MachinesController } from './machines/controllers/machines.controller';
import { MachinesService } from './machines/services/machines.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([Machine, WorkCenter]),
  ],
  controllers: [MachinesController],
  providers: [MachinesService],
  exports: [MachinesService, TypeOrmModule],
})
export class MachinesModule {}
