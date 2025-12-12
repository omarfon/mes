import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Route } from './entities/route.entity';
import { RouteOperation } from './entities/route-operation.entity';
import { RoutesController } from './routes.controller';
import { RoutesService } from './routes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Route, RouteOperation])],
  controllers: [RoutesController],
  providers: [RoutesService],
  exports: [RoutesService, TypeOrmModule],
})
export class RoutesModule {}
