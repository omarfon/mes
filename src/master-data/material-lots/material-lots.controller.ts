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
import { CreateMaterialLotDto } from './dto/create-material-lot.dto';
import { UpdateMaterialLotDto } from './dto/update-material-lot.dto';
import { FilterMaterialLotDto } from './dto/filter-material-lot.dto';
import { MaterialLotsService } from './material-lots.service';

@Controller('master-data/material-lots')
export class MaterialLotsController {
  constructor(private readonly materialLotsService: MaterialLotsService) {}

  @Post()
  async create(@Body() dto: CreateMaterialLotDto) {
    return this.materialLotsService.create(dto);
  }

  @Get()
  async findAll(@Query() filter: FilterMaterialLotDto) {
    return this.materialLotsService.findAll(filter);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.materialLotsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateMaterialLotDto,
  ) {
    return this.materialLotsService.update(id, dto);
  }

  /**
   * PATCH material-lots/:id
   */
  @Patch(':id')
  async patch(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateMaterialLotDto,
  ) {
    return this.materialLotsService.update(id, dto);
  }  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.materialLotsService.remove(id);
  }
}
