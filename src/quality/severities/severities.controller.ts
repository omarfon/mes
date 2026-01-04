import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SeveritiesService } from './severities.service';
import { CreateSeverityDto } from './dto/create-severity.dto';
import { UpdateSeverityDto } from './dto/update-severity.dto';

@ApiTags('Quality - Severities')
@Controller('quality/severities')
export class SeveritiesController {
  constructor(private readonly severitiesService: SeveritiesService) {}

  @Post()
  create(@Body() createDto: CreateSeverityDto) {
    return this.severitiesService.create(createDto);
  }

  @Get()
  findAll(@Query('isActive') isActive?: boolean) {
    return this.severitiesService.findAll(isActive);
  }

  @Get('code/:code')
  findByCode(@Param('code') code: string) {
    return this.severitiesService.findByCode(code);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.severitiesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateSeverityDto) {
    return this.severitiesService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.severitiesService.remove(id);
  }
}
