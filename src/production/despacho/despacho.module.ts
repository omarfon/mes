import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Despacho } from './entities/despacho.entity';
import { DespachoService } from './despacho.service';
import { DespachoController } from './despacho.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Despacho])],
  controllers: [DespachoController],
  providers: [DespachoService],
  exports: [DespachoService, TypeOrmModule],
})
export class DespachoModule {}
