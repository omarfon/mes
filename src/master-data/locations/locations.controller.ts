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
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { FilterLocationDto } from './dto/filter-location.dto';
import { LocationsService } from './locations.service';

@Controller('master-data/locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  async create(@Body() dto: CreateLocationDto, @Request() req) {
    return this.locationsService.create(dto, req.user?.userId, req.ip);
  }

  @Get()
  async findAll(@Query() filter: FilterLocationDto) {
    return this.locationsService.findAll(filter);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.locationsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateLocationDto,
    @Request() req,
  ) {
    return this.locationsService.update(id, dto, req.user?.userId, req.ip);
  }

  /**
   * PATCH locations/:id
   */
  @Patch(':id')
  async patch(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateLocationDto,
    @Request() req,
  ) {
    return this.locationsService.update(id, dto, req.user?.userId, req.ip);
  }  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string, @Request() req) {
    await this.locationsService.remove(id, req.user?.userId, req.ip);
  }

  @Patch(':id/active')
  async toggleActive(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('active') active: boolean,
  ) {
    return this.locationsService.toggleActive(id, active);
  }
}
