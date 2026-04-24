import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StandardTime } from './entities/standard-time.entity';
import { StandardTimesController } from './standard-times.controller';
import { StandardTimesService } from './standard-times.service';

@Module({
  imports: [TypeOrmModule.forFeature([StandardTime])],
  controllers: [StandardTimesController],
  providers: [StandardTimesService],
  exports: [StandardTimesService, TypeOrmModule],
})
export class StandardTimesModule {}
