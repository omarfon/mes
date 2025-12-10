import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DataCollectionService } from './data-collection.service';
import { CreateDataCollectionDto } from './dto/create-data-collection.dto';
import { UpdateDataCollectionDto } from './dto/update-data-collection.dto';

@Controller('data-collection')
export class DataCollectionController {
  constructor(private readonly dataCollectionService: DataCollectionService) {}

  @Post()
  create(@Body() createDataCollectionDto: CreateDataCollectionDto) {
    return this.dataCollectionService.create(createDataCollectionDto);
  }

  @Get()
  findAll() {
    return this.dataCollectionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dataCollectionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDataCollectionDto: UpdateDataCollectionDto) {
    return this.dataCollectionService.update(+id, updateDataCollectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dataCollectionService.remove(+id);
  }
}
