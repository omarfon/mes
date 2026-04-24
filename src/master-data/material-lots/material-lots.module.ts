import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialLot } from './entities/material-lot.entity';
import { MaterialLotsController } from './material-lots.controller';
import { MaterialLotsService } from './material-lots.service';

@Module({
  imports: [TypeOrmModule.forFeature([MaterialLot])],
  controllers: [MaterialLotsController],
  providers: [MaterialLotsService],
  exports: [MaterialLotsService, TypeOrmModule],
})
export class MaterialLotsModule {}
