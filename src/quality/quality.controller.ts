import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QualityService } from './quality.service';


@Controller('quality')
export class QualityController {
  constructor(private readonly qualityService: QualityService) {}

 
  @Get()
  findAll() {
    return this.qualityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.qualityService.findOne(+id);
  }

 

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.qualityService.remove(+id);
  }
}
