import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WorkCentersService } from './work-centers.service';
import { CreateWorkCenterDto } from './dto/create-work-center.dto';
import { UpdateWorkCenterDto } from './dto/update-work-center.dto';

@Controller('work-centers')
export class WorkCentersController {
  constructor(private readonly workCentersService: WorkCentersService) {}

  @Post()
  create(@Body() createWorkCenterDto: CreateWorkCenterDto) {
    return this.workCentersService.create(createWorkCenterDto);
  }

  @Get()
  findAll() {
    return this.workCentersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workCentersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkCenterDto: UpdateWorkCenterDto) {
    return this.workCentersService.update(+id, updateWorkCenterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workCentersService.remove(+id);
  }
}
