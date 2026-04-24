import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillOfMaterial } from './entities/bill-of-material.entity';
import { BomLine } from './entities/bom-line.entity';
import { BillOfMaterialsController } from './bill-of-materials.controller';
import { BillOfMaterialsService } from './bill-of-materials.service';

@Module({
  imports: [TypeOrmModule.forFeature([BillOfMaterial, BomLine])],
  controllers: [BillOfMaterialsController],
  providers: [BillOfMaterialsService],
  exports: [BillOfMaterialsService, TypeOrmModule],
})
export class BillOfMaterialsModule {}
