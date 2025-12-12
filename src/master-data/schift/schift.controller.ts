import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SchiftService } from './schift.service';
import { CreateSchiftDto } from './dto/create-schift.dto';
import { UpdateSchiftDto } from './dto/update-schift.dto';

@Controller('schift')
export class SchiftController {
  constructor(private readonly schiftService: SchiftService) {}

  @Post()
  create(@Body() createSchiftDto: CreateSchiftDto) {
    return this.schiftService.create(createSchiftDto);
  }

  @Get()
  findAll() {
    return this.schiftService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.schiftService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSchiftDto: UpdateSchiftDto) {
    return this.schiftService.update(+id, updateSchiftDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.schiftService.remove(+id);
  }
}
