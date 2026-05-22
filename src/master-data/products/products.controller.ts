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
  Request,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { FilterProductsDto } from './dto/filter-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';


@Controller('master-data/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * Crear producto
   * POST /products
   */
  @Post()
  async create(@Body() dto: CreateProductDto, @Request() req) {
    return this.productsService.create(dto, req.user?.userId, req.ip);
  }

  /**
   * Listar productos con filtros/paginación
   * GET /products?search=&type=&page=&limit=&isActive=
   */
  @Get()
  async findAll(@Query() filter: FilterProductsDto) {
    return this.productsService.findAll(filter);
  }

  /**
   * Obtener producto por ID
   * GET /products/:id
   */
  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.productsService.findOne(id);
  }

  /**
   * Actualizar producto
   * PATCH /products/:id
   */
  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateProductDto,
    @Request() req,
  ) {
    return this.productsService.update(id, dto, req.user?.userId, req.ip);
  }

  /**
   * Activar / desactivar producto
   * PATCH /products/:id/active
   */
  @Patch(':id/active')
  async toggleActive(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('isActive') isActive: boolean,
  ) {
    return this.productsService.toggleActive(id, isActive);
  }

  /**
   * Borrado lógico
   * DELETE /products/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string, @Request() req): Promise<void> {
    await this.productsService.softDelete(id, req.user?.userId, req.ip);
  }
}
