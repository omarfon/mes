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
import { CreateOrderTypeDto } from './dto/create-order-type.dto';
import { UpdateOrderTypeDto } from './dto/update-order-type.dto';
import { FilterOrderTypeDto } from './dto/filter-order-type.dto';
import { OrderTypesService } from './order-types.service';

@Controller('master-data/order-types')
export class OrderTypesController {
  constructor(private readonly orderTypesService: OrderTypesService) {}

  @Post()
  async create(@Body() dto: CreateOrderTypeDto, @Request() req) {
    return this.orderTypesService.create(dto, req.user?.userId, req.ip);
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
    @Request() req,
  ) {
    return this.orderTypesService.update(id, dto, req.user?.userId, req.ip);
  }

  /**
   * PATCH order-types/:id
   */
  @Patch(':id')
  async patch(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateOrderTypeDto,
    @Request() req,
  ) {
    return this.orderTypesService.update(id, dto, req.user?.userId, req.ip);
  }  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string, @Request() req) {
    await this.orderTypesService.remove(id, req.user?.userId, req.ip);
  }

  @Patch(':id/active')
  async toggleActive(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('active') active: boolean,
  ) {
    return this.orderTypesService.toggleActive(id, active);
  }
}
