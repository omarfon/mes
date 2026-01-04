import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FamiliesService } from './families.service';
import { CreateDefectFamilyDto } from './dto/create-defect-family.dto';
import { UpdateDefectFamilyDto } from './dto/update-defect-family.dto';

@ApiTags('Quality - Defect Families')
@Controller('quality/defect-families')
export class FamiliesController {
  constructor(private readonly familiesService: FamiliesService) {}

  @Post()
  create(@Body() createDto: CreateDefectFamilyDto) {
    return this.familiesService.create(createDto);
  }

  @Get()
  findAll(@Query('isActive') isActive?: boolean) {
    return this.familiesService.findAll(isActive);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.familiesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateDefectFamilyDto) {
    return this.familiesService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.familiesService.remove(id);
  }
}
