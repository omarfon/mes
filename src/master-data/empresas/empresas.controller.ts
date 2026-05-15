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
import { EmpresasService } from './empresas.service';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { FilterEmpresaDto } from './dto/filter-empresa.dto';

@Controller('master-data/empresas')
export class EmpresasController {
  constructor(private readonly empresasService: EmpresasService) {}

  @Post()
  async create(@Body() dto: CreateEmpresaDto) {
    return this.empresasService.create(dto);
  }

  @Get()
  async findAll(@Query() filter: FilterEmpresaDto) {
    return this.empresasService.findAll(filter);
  }

  /** GET /master-data/empresas/list?search=xxx  — para selectores del frontend */
  @Get('list')
  async listForSelect(@Query('search') search?: string) {
    return this.empresasService.listForSelect(search);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.empresasService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateEmpresaDto,
  ) {
    return this.empresasService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.empresasService.remove(id);
  }

  @Patch(':id/active')
  async toggleActive(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('active') active: boolean,
  ) {
    return this.empresasService.toggleActive(id, active);
  }
}
