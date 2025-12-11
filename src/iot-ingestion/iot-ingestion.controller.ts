import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IotIngestionService } from './iot-ingestion.service';
import { CreateIotIngestionDto } from './dto/create-iot-ingestion.dto';
import { UpdateIotIngestionDto } from './dto/update-iot-ingestion.dto';

@Controller('iot-ingestion')
export class IotIngestionController {
  constructor(private readonly iotIngestionService: IotIngestionService) {}

  @Post()
  create(@Body() createIotIngestionDto: CreateIotIngestionDto) {
    return this.iotIngestionService.create(createIotIngestionDto);
  }

  @Get()
  findAll() {
    return this.iotIngestionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.iotIngestionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIotIngestionDto: UpdateIotIngestionDto) {
    return this.iotIngestionService.update(+id, updateIotIngestionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.iotIngestionService.remove(+id);
  }
}
