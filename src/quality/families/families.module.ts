import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FamiliesService } from './families.service';
import { FamiliesController } from './families.controller';
import { DefectFamily } from './entities/defect-family.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DefectFamily])],
  controllers: [FamiliesController],
  providers: [FamiliesService],
  exports: [FamiliesService],
})
export class FamiliesModule {}
