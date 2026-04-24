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
import { CreateOrderTypeDto } from './dto/create-order-type.dto';
import { UpdateOrderTypeDto } from './dto/update-order-type.dto';
import { FilterOrderTypeDto } from './dto/filter-order-type.dto';
import { OrderTypesService } from './order-types.service';

@Controller('master-data/order-types')
export class OrderTypesController {
  constructor(private readonly orderTypesService: OrderTypesService) {}

  @Post()
  async create(@Body() dto: CreateOrderTypeDto) {
    return this.orderTypesService.create(dto);
  }

  @Get()
  async findAll(@Query() filter: FilterOrderTypeDto) {
    return this.orderTypesService.findAll(filter);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.orderTypesService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateOrderTypeDto,
  ) {
    return this.orderTypesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.orderTypesService.remove(id);
  }

  @Patch(':id/active')
  async toggleActive(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('active') active: boolean,
  ) {
    return this.orderTypesService.toggleActive(id, active);
  }
}
