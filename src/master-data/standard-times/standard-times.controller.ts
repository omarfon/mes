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
import { CreateStandardTimeDto } from './dto/create-standard-time.dto';
import { UpdateStandardTimeDto } from './dto/update-standard-time.dto';
import { FilterStandardTimeDto } from './dto/filter-standard-time.dto';
import { StandardTimesService } from './standard-times.service';

@Controller('master-data/standard-times')
export class StandardTimesController {
  constructor(private readonly standardTimesService: StandardTimesService) {}

  @Post()
  async create(@Body() dto: CreateStandardTimeDto, @Request() req) {
    return this.standardTimesService.create(dto, req.user?.userId, req.ip);
  }

  @Get()
  async findAll(@Query() filter: FilterStandardTimeDto) {
    return this.standardTimesService.findAll(filter);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.standardTimesService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateStandardTimeDto,
    @Request() req,
  ) {
    return this.standardTimesService.update(id, dto, req.user?.userId, req.ip);
  }

  /**
   * PATCH standard-times/:id
   */
  @Patch(':id')
  async patch(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateStandardTimeDto,
    @Request() req,
  ) {
    return this.standardTimesService.update(id, dto, req.user?.userId, req.ip);
  }  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string, @Request() req) {
    await this.standardTimesService.remove(id, req.user?.userId, req.ip);
  }

  @Patch(':id/active')
  async toggleActive(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('active') active: boolean,
  ) {
    return this.standardTimesService.toggleActive(id, active);
  }
}
