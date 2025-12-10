import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DispatchingService } from './dispatching.service';
import { CreateDispatchingDto } from './dto/create-dispatching.dto';
import { UpdateDispatchingDto } from './dto/update-dispatching.dto';

@Controller('dispatching')
export class DispatchingController {
  constructor(private readonly dispatchingService: DispatchingService) {}

  @Post()
  create(@Body() createDispatchingDto: CreateDispatchingDto) {
    return this.dispatchingService.create(createDispatchingDto);
  }

  @Get()
  findAll() {
    return this.dispatchingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dispatchingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDispatchingDto: UpdateDispatchingDto) {
    return this.dispatchingService.update(+id, updateDispatchingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dispatchingService.remove(+id);
  }
}
