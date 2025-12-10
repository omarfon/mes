import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TraceabilityService } from './traceability.service';
import { CreateTraceabilityDto } from './dto/create-traceability.dto';
import { UpdateTraceabilityDto } from './dto/update-traceability.dto';

@Controller('traceability')
export class TraceabilityController {
  constructor(private readonly traceabilityService: TraceabilityService) {}

  @Post()
  create(@Body() createTraceabilityDto: CreateTraceabilityDto) {
    return this.traceabilityService.create(createTraceabilityDto);
  }

  @Get()
  findAll() {
    return this.traceabilityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.traceabilityService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTraceabilityDto: UpdateTraceabilityDto) {
    return this.traceabilityService.update(+id, updateTraceabilityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.traceabilityService.remove(+id);
  }
}
