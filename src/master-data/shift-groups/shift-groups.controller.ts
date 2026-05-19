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
import { CreateShiftGroupDto } from './dto/create-shift-group.dto';
import { UpdateShiftGroupDto } from './dto/update-shift-group.dto';
import { FilterShiftGroupDto } from './dto/filter-shift-group.dto';
import { ShiftGroupsService } from './shift-groups.service';

@Controller('master-data/shift-groups')
export class ShiftGroupsController {
  constructor(private readonly shiftGroupsService: ShiftGroupsService) {}

  @Post()
  async create(@Body() dto: CreateShiftGroupDto) {
    return this.shiftGroupsService.create(dto);
  }

  @Get()
  async findAll(@Query() filter: FilterShiftGroupDto) {
    return this.shiftGroupsService.findAll(filter);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.shiftGroupsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateShiftGroupDto,
  ) {
    return this.shiftGroupsService.update(id, dto);
  }

  /**
   * PATCH shift-groups/:id
   */
  @Patch(':id')
  async patch(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateShiftGroupDto,
  ) {
    return this.shiftGroupsService.update(id, dto);
  }  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.shiftGroupsService.remove(id);
  }

  @Patch(':id/active')
  async toggleActive(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('active') active: boolean,
  ) {
    return this.shiftGroupsService.toggleActive(id, active);
  }
}
