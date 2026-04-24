import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShiftGroup } from './entities/shift-group.entity';
import { ShiftGroupsController } from './shift-groups.controller';
import { ShiftGroupsService } from './shift-groups.service';

@Module({
  imports: [TypeOrmModule.forFeature([ShiftGroup])],
  controllers: [ShiftGroupsController],
  providers: [ShiftGroupsService],
  exports: [ShiftGroupsService, TypeOrmModule],
})
export class ShiftGroupsModule {}
