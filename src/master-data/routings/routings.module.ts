import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Routing } from './entities/routing.entity';
import { RoutingStep } from './entities/routing-step.entity';
import { RoutingsController } from './routings.controller';
import { RoutingsService } from './routings.service';

@Module({
  imports: [TypeOrmModule.forFeature([Routing, RoutingStep])],
  controllers: [RoutingsController],
  providers: [RoutingsService],
  exports: [RoutingsService, TypeOrmModule],
})
export class RoutingsModule {}
