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
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { FilterSupplierDto } from './dto/filter-supplier.dto';
import { SuppliersService } from './suppliers.service';

@Controller('master-data/suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Post()
  async create(@Body() dto: CreateSupplierDto, @Request() req) {
    return this.suppliersService.create(dto, req.user?.userId, req.ip);
  }

  @Get()
  async findAll(@Query() filter: FilterSupplierDto) {
    return this.suppliersService.findAll(filter);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.suppliersService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateSupplierDto,
    @Request() req,
  ) {
    return this.suppliersService.update(id, dto, req.user?.userId, req.ip);
  }

  /**
   * PATCH suppliers/:id
   */
  @Patch(':id')
  async patch(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateSupplierDto,
    @Request() req,
  ) {
    return this.suppliersService.update(id, dto, req.user?.userId, req.ip);
  }  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string, @Request() req) {
    await this.suppliersService.remove(id, req.user?.userId, req.ip);
  }

  @Patch(':id/active')
  async toggleActive(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('active') active: boolean,
  ) {
    return this.suppliersService.toggleActive(id, active);
  }
}
