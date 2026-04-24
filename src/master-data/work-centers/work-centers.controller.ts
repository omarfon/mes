import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateWorkCenterDto } from './dto/create-work-center.dto';
import { FilterWorkCentersDto } from './dto/filter-work-center.dto';
import { UpdateWorkCenterDto } from './dto/update-work-center.dto';
import { WorkCentersService } from './work-centers.service';

@Controller('master-data/work-centers')
export class WorkCentersController {
  constructor(private readonly workCentersService: WorkCentersService) {}

  @Post()
  async create(@Body() dto: CreateWorkCenterDto) {
    return this.workCentersService.create(dto);
  }

  @Get()
  async findAll(@Query() filter: FilterWorkCentersDto) {
    return this.workCentersService.findAll(filter);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.workCentersService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateWorkCenterDto,
  ) {
    return this.workCentersService.update(id, dto);
  }

  @Patch(':id/active')
  async toggleActive(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('active') active: boolean,
  ) {
    return this.workCentersService.toggleActive(id, active);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.workCentersService.softDelete(id);
  }
}
