import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialLot } from './entities/material-lot.entity';
import { MaterialLotsController } from './material-lots.controller';
import { MaterialLotsService } from './material-lots.service';

import { AuditsModule } from '../../traceability/audits/audits.module';

@Module({
  imports: [TypeOrmModule.forFeature([MaterialLot]), AuditsModule],
  controllers: [MaterialLotsController],
  providers: [MaterialLotsService],
  exports: [MaterialLotsService, TypeOrmModule],
})
export class MaterialLotsModule {}
