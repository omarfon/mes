import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenealogyService } from './genealogy.service';
import { GenealogyController } from './genealogy.controller';
import { LotGenealogy } from './entities/lot-genealogy.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LotGenealogy])],
  controllers: [GenealogyController],
  providers: [GenealogyService],
  exports: [GenealogyService],
})
export class GenealogyModule {}
