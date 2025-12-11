import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
// Update the import path below to the correct location of your service file.
// For example, if the correct path is '../services/work-centers.service', use that:
import { MasterDataService } from '../master-data.service';
import { CreateMasterDatumDto } from '../dto/create-master-datum.dto';
import { UpdateMasterDatumDto } from '../dto/update-master-datum.dto';

@Controller('work-centers')
export class WorkCentersController {
  constructor(private readonly masterDataService: MasterDataService) {}

  @Post()
  create(@Body() createMasterDatumDto: CreateMasterDatumDto) {
    return this.masterDataService.create(createMasterDatumDto);
  }

  @Get()
  findAll() {
    return this.masterDataService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.masterDataService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMasterDatumDto: UpdateMasterDatumDto) {
    return this.masterDataService.update(+id, updateMasterDatumDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.masterDataService.remove(+id);
  }
}
