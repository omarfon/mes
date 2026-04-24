import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovementType } from './entities/movement-type.entity';
import { MovementTypesController } from './movement-types.controller';
import { MovementTypesService } from './movement-types.service';

@Module({
  imports: [TypeOrmModule.forFeature([MovementType])],
  controllers: [MovementTypesController],
  providers: [MovementTypesService],
  exports: [MovementTypesService, TypeOrmModule],
})
export class MovementTypesModule {}
