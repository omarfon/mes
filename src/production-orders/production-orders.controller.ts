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
  Query,
} from '@nestjs/common';
import { CreateProductionOrderDto } from './dto/create-production-order.dto';
import { FilterProductionOrdersDto } from './dto/filter-production-order.dto';
import { UpdateProductionOrderDto } from './dto/update-production-order.dto';
import { ProductionOrderStatus } from './entities/production-order.entity';
import { ProductionOrdersService } from './production-orders.service';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

@ApiTags('Órdenes de Producción')
@Controller('production-orders')
export class ProductionOrdersController {
  constructor(
    private readonly productionOrdersService: ProductionOrdersService,
  ) {}

  @Post()
  async create(@Body() dto: CreateProductionOrderDto) {
    return this.productionOrdersService.create(dto);
  }

  @Get()
  async findAll(@Query() filter: FilterProductionOrdersDto) {
    return this.productionOrdersService.findAll(filter);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.productionOrdersService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateProductionOrderDto,
  ) {
    return this.productionOrdersService.update(id, dto);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('status') status: ProductionOrderStatus,
  ) {
    return this.productionOrdersService.updateStatus(id, status);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.productionOrdersService.softDelete(id);
  }
}
