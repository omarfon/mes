import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DefectsService } from './defects.service';
import { DefectsController } from './defects.controller';
import { Defect } from './entities/defect.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Defect])],
  controllers: [DefectsController],
  providers: [DefectsService],
  exports: [DefectsService],
})
export class DefectsModule {}
