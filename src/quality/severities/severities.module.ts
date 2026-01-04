import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeveritiesService } from './severities.service';
import { SeveritiesController } from './severities.controller';
import { Severity } from './entities/severity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Severity])],
  controllers: [SeveritiesController],
  providers: [SeveritiesService],
  exports: [SeveritiesService],
})
export class SeveritiesModule {}
