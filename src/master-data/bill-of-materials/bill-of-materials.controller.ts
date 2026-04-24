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
import { CreateBillOfMaterialDto, CreateBomLineDto } from './dto/create-bill-of-material.dto';
import { UpdateBillOfMaterialDto, UpdateBomLineDto } from './dto/update-bill-of-material.dto';
import { FilterBillOfMaterialDto } from './dto/filter-bill-of-material.dto';
import { BillOfMaterialsService } from './bill-of-materials.service';

@Controller('master-data/bill-of-materials')
export class BillOfMaterialsController {
  constructor(private readonly billOfMaterialsService: BillOfMaterialsService) {}

  @Post()
  async create(@Body() dto: CreateBillOfMaterialDto) {
    return this.billOfMaterialsService.create(dto);
  }

  @Get()
  async findAll(@Query() filter: FilterBillOfMaterialDto) {
    return this.billOfMaterialsService.findAll(filter);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.billOfMaterialsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateBillOfMaterialDto,
  ) {
    return this.billOfMaterialsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.billOfMaterialsService.remove(id);
  }

  @Patch(':id/active')
  async toggleActive(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('active') active: boolean,
  ) {
    return this.billOfMaterialsService.toggleActive(id, active);
  }

  // Lines sub-endpoints
  @Post(':bomId/lines')
  async createLine(
    @Param('bomId', new ParseUUIDPipe()) bomId: string,
    @Body() dto: CreateBomLineDto,
  ) {
    return this.billOfMaterialsService.createLine(bomId, dto);
  }

  @Get(':bomId/lines')
  async getLines(@Param('bomId', new ParseUUIDPipe()) bomId: string) {
    return this.billOfMaterialsService.getLines(bomId);
  }

  @Put(':bomId/lines/:lineId')
  async updateLine(
    @Param('bomId', new ParseUUIDPipe()) bomId: string,
    @Param('lineId', new ParseUUIDPipe()) lineId: string,
    @Body() dto: UpdateBomLineDto,
  ) {
    return this.billOfMaterialsService.updateLine(bomId, lineId, dto);
  }

  @Delete(':bomId/lines/:lineId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteLine(
    @Param('bomId', new ParseUUIDPipe()) bomId: string,
    @Param('lineId', new ParseUUIDPipe()) lineId: string,
  ) {
    await this.billOfMaterialsService.deleteLine(bomId, lineId);
  }
}
