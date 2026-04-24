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
import { CreateMovementTypeDto } from './dto/create-movement-type.dto';
import { UpdateMovementTypeDto } from './dto/update-movement-type.dto';
import { FilterMovementTypeDto } from './dto/filter-movement-type.dto';
import { MovementTypesService } from './movement-types.service';

@Controller('master-data/movement-types')
export class MovementTypesController {
  constructor(private readonly movementTypesService: MovementTypesService) {}

  @Post()
  async create(@Body() dto: CreateMovementTypeDto) {
    return this.movementTypesService.create(dto);
  }

  @Get()
  async findAll(@Query() filter: FilterMovementTypeDto) {
    return this.movementTypesService.findAll(filter);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.movementTypesService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateMovementTypeDto,
  ) {
    return this.movementTypesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.movementTypesService.remove(id);
  }

  @Patch(':id/active')
  async toggleActive(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('active') active: boolean,
  ) {
    return this.movementTypesService.toggleActive(id, active);
  }
}
