import { Module } from '@nestjs/common';
import { SchiftService } from './schift.service';
import { SchiftController } from './schift.controller';

@Module({
  controllers: [SchiftController],
  providers: [SchiftService],
})
export class SchiftModule {}
