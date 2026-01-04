import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SerialsService } from './serials.service';
import { SerialsController } from './serials.controller';
import { Serial } from './entities/serial.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Serial])],
  controllers: [SerialsController],
  providers: [SerialsService],
  exports: [SerialsService],
})
export class SerialsModule {}
