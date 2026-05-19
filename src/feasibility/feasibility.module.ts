import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeasibilityHistory } from './entities/feasibility-history.entity';
import { FeasibilityService } from './feasibility.service';
import { FeasibilityController } from './feasibility.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FeasibilityHistory])],
  providers: [FeasibilityService],
  controllers: [FeasibilityController],
})
export class FeasibilityModule {}
