import { Module } from '@nestjs/common';
import { DataCollectionService } from './data-collection.service';
import { DataCollectionController } from './data-collection.controller';

@Module({
  controllers: [DataCollectionController],
  providers: [DataCollectionService],
})
export class DataCollectionModule {}
