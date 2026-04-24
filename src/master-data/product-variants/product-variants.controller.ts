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
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { FilterProductVariantDto } from './dto/filter-product-variant.dto';
import { ProductVariantsService } from './product-variants.service';

@Controller('master-data/product-variants')
export class ProductVariantsController {
  constructor(private readonly variantsService: ProductVariantsService) {}

  @Post()
  async create(@Body() dto: CreateProductVariantDto) {
    return this.variantsService.create(dto);
  }

  @Get()
  async findAll(@Query() filter: FilterProductVariantDto) {
    return this.variantsService.findAll(filter);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.variantsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateProductVariantDto,
  ) {
    return this.variantsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.variantsService.remove(id);
  }

  @Patch(':id/active')
  async toggleActive(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('active') active: boolean,
  ) {
    return this.variantsService.toggleActive(id, active);
  }
}
