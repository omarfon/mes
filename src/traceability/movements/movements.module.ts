import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovementsService } from './movements.service';
import { MovementsController } from './movements.controller';
import { LotMovement } from './entities/lot-movement.entity';
import { LotsModule } from '../lots/lots.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LotMovement]),
    LotsModule,
  ],
  controllers: [MovementsController],
  providers: [MovementsService],
  exports: [MovementsService],
})
export class MovementsModule {}
