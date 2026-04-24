import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScrapReason } from './entities/scrap-reason.entity';
import { ScrapReasonsController } from './scrap-reasons.controller';
import { ScrapReasonsService } from './scrap-reasons.service';

@Module({
  imports: [TypeOrmModule.forFeature([ScrapReason])],
  controllers: [ScrapReasonsController],
  providers: [ScrapReasonsService],
  exports: [ScrapReasonsService, TypeOrmModule],
})
export class ScrapReasonsModule {}
