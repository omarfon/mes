import { Injectable } from '@nestjs/common';
import { CreateDataCollectionDto } from './dto/create-data-collection.dto';
import { UpdateDataCollectionDto } from './dto/update-data-collection.dto';

@Injectable()
export class DataCollectionService {
  create(createDataCollectionDto: CreateDataCollectionDto) {
    return 'This action adds a new dataCollection';
  }

  findAll() {
    return `This action returns all dataCollection`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dataCollection`;
  }

  update(id: number, updateDataCollectionDto: UpdateDataCollectionDto) {
    return `This action updates a #${id} dataCollection`;
  }

  remove(id: number) {
    return `This action removes a #${id} dataCollection`;
  }
}
