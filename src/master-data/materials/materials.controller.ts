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
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { FilterMaterialDto } from './dto/filter-material.dto';
import { MaterialsService } from './materials.service';

@Controller('master-data/materials')
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Post()
  async create(@Body() dto: CreateMaterialDto, @Request() req) {
    return this.materialsService.create(dto, req.user?.userId, req.ip);
  }

  @Get()
  async findAll(@Query() filter: FilterMaterialDto) {
    return this.materialsService.findAll(filter);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.materialsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateMaterialDto,
    @Request() req,
  ) {
    return this.materialsService.update(id, dto, req.user?.userId, req.ip);
  }

  /**
   * PATCH materials/:id
   */
  @Patch(':id')
  async patch(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateMaterialDto,
    @Request() req,
  ) {
    return this.materialsService.update(id, dto, req.user?.userId, req.ip);
  }  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string, @Request() req) {
    await this.materialsService.remove(id, req.user?.userId, req.ip);
  }

  @Patch(':id/active')
  async toggleActive(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('active') active: boolean,
  ) {
    return this.materialsService.toggleActive(id, active);
  }
}
