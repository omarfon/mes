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
  Request,
} from '@nestjs/common';
import { CreateShiftGroupDto } from './dto/create-shift-group.dto';
import { UpdateShiftGroupDto } from './dto/update-shift-group.dto';
import { FilterShiftGroupDto } from './dto/filter-shift-group.dto';
import { ShiftGroupsService } from './shift-groups.service';

@Controller('master-data/shift-groups')
export class ShiftGroupsController {
  constructor(private readonly shiftGroupsService: ShiftGroupsService) {}

  @Post()
  async create(@Body() dto: CreateShiftGroupDto, @Request() req) {
    return this.shiftGroupsService.create(dto, req.user?.userId, req.ip);
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
    @Request() req,
  ) {
    return this.shiftGroupsService.update(id, dto, req.user?.userId, req.ip);
  }

  /**
   * PATCH shift-groups/:id
   */
  @Patch(':id')
  async patch(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateShiftGroupDto,
    @Request() req,
  ) {
    return this.shiftGroupsService.update(id, dto, req.user?.userId, req.ip);
  }  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string, @Request() req) {
    await this.shiftGroupsService.remove(id, req.user?.userId, req.ip);
  }

  @Patch(':id/active')
  async toggleActive(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('active') active: boolean,
  ) {
    return this.shiftGroupsService.toggleActive(id, active);
  }
}
