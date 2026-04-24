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
  Put,
  Query,
} from '@nestjs/common';
import { CreateWorkstationDto } from './dto/create-workstation.dto';
import { UpdateWorkstationDto } from './dto/update-workstation.dto';
import { FilterWorkstationDto } from './dto/filter-workstation.dto';
import { WorkstationsService } from './workstations.service';

@Controller('master-data/workstations')
export class WorkstationsController {
  constructor(private readonly workstationsService: WorkstationsService) {}

  @Post()
  async create(@Body() dto: CreateWorkstationDto) {
    return this.workstationsService.create(dto);
  }

  @Get()
  async findAll(@Query() filter: FilterWorkstationDto) {
    return this.workstationsService.findAll(filter);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.workstationsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateWorkstationDto,
  ) {
    return this.workstationsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.workstationsService.remove(id);
  }

  @Patch(':id/active')
  async toggleActive(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('active') active: boolean,
  ) {
    return this.workstationsService.toggleActive(id, active);
  }
}
