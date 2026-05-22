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
import { CreateMovementTypeDto } from './dto/create-movement-type.dto';
import { UpdateMovementTypeDto } from './dto/update-movement-type.dto';
import { FilterMovementTypeDto } from './dto/filter-movement-type.dto';
import { MovementTypesService } from './movement-types.service';

@Controller('master-data/movement-types')
export class MovementTypesController {
  constructor(private readonly movementTypesService: MovementTypesService) {}

  @Post()
  async create(@Body() dto: CreateMovementTypeDto, @Request() req) {
    return this.movementTypesService.create(dto, req.user?.userId, req.ip);
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
    @Request() req,
  ) {
    return this.movementTypesService.update(id, dto, req.user?.userId, req.ip);
  }

  /**
   * PATCH movement-types/:id
   */
  @Patch(':id')
  async patch(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateMovementTypeDto,
    @Request() req,
  ) {
    return this.movementTypesService.update(id, dto, req.user?.userId, req.ip);
  }  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string, @Request() req) {
    await this.movementTypesService.remove(id, req.user?.userId, req.ip);
  }

  @Patch(':id/active')
  async toggleActive(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('active') active: boolean,
  ) {
    return this.movementTypesService.toggleActive(id, active);
  }
}
