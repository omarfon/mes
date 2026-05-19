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
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
import { FilterPlantDto } from './dto/filter-plant.dto';
import { PlantsService } from './plants.service';

@Controller('master-data/plants')
export class PlantsController {
  constructor(private readonly plantsService: PlantsService) {}

  /**
   * POST /master-data/plants
   */
  @Post()
  async create(@Body() dto: CreatePlantDto) {
    return this.plantsService.create(dto);
  }

  /**
   * GET /master-data/plants
   */
  @Get()
  async findAll(@Query() filter: FilterPlantDto) {
    return this.plantsService.findAll(filter);
  }

  /**
   * GET /master-data/plants/:id
   */
  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.plantsService.findOne(id);
  }

  /**
   * PUT /master-data/plants/:id
   */
  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdatePlantDto,
  ) {
    return this.plantsService.update(id, dto);
  }

  /**
   * PATCH plants/:id
   */
  @Patch(':id')
  async patch(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdatePlantDto,
  ) {
    return this.plantsService.update(id, dto);
  }

  /**
   * DELETE /master-data/plants/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.plantsService.remove(id);
  }

  /**
   * PATCH /master-data/plants/:id/active
   */
  @Patch(':id/active')
  async toggleActive(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('active') active: boolean,
  ) {
    return this.plantsService.toggleActive(id, active);
  }
}
