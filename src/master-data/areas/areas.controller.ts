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
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { FilterAreaDto } from './dto/filter-area.dto';
import { AreasService } from './areas.service';

@Controller('master-data/areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  /**
   * POST /master-data/areas
   */
  @Post()
  async create(@Body() dto: CreateAreaDto) {
    return this.areasService.create(dto);
  }

  /**
   * GET /master-data/areas
   */
  @Get()
  async findAll(@Query() filter: FilterAreaDto) {
    return this.areasService.findAll(filter);
  }

  /**
   * GET /master-data/areas/:id
   */
  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.areasService.findOne(id);
  }

  /**
   * PUT /master-data/areas/:id
   */
  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateAreaDto,
  ) {
    return this.areasService.update(id, dto);
  }

  /**
   * DELETE /master-data/areas/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.areasService.remove(id);
  }

  /**
   * PATCH /master-data/areas/:id/active
   */
  @Patch(':id/active')
  async toggleActive(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('active') active: boolean,
  ) {
    return this.areasService.toggleActive(id, active);
  }
}
