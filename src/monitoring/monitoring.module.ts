import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonitoringService } from './monitoring.service';
import { MonitoringController } from './monitoring.controller';
import { MachineEvent } from './entities/machine-event.entity';
import { MachinesModule } from '../master-data/machines/machines.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MachineEvent]),
    MachinesModule,
  ],
  controllers: [MonitoringController],
  providers: [MonitoringService],
})
export class MonitoringModule { }
