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
  Request,
} from '@nestjs/common';
import { CreateWorkCenterDto } from './dto/create-work-center.dto';
import { FilterWorkCentersDto } from './dto/filter-work-center.dto';
import { UpdateWorkCenterDto } from './dto/update-work-center.dto';
import { WorkCentersService } from './work-centers.service';

@Controller('master-data/work-centers')
export class WorkCentersController {
  constructor(private readonly workCentersService: WorkCentersService) {}

  @Post()
  async create(@Body() dto: CreateWorkCenterDto, @Request() req) {
    return this.workCentersService.create(dto, req.user?.userId, req.ip);
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
    @Request() req,
  ) {
    return this.workCentersService.update(id, dto, req.user?.userId, req.ip);
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
  async remove(@Param('id', new ParseUUIDPipe()) id: string, @Request() req): Promise<void> {
    await this.workCentersService.softDelete(id, req.user?.userId, req.ip);
  }
}
