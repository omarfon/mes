import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workstation } from './entities/workstation.entity';
import { WorkstationsController } from './workstations.controller';
import { WorkstationsService } from './workstations.service';

@Module({
  imports: [TypeOrmModule.forFeature([Workstation])],
  controllers: [WorkstationsController],
  providers: [WorkstationsService],
  exports: [WorkstationsService, TypeOrmModule],
})
export class WorkstationsModule {}
