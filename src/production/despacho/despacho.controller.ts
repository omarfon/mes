import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { DespachoService } from './despacho.service';
import { CreateDespachoDto } from './dto/create-despacho.dto';
import { UpdateDespachoDto } from './dto/update-despacho.dto';
import { FilterDespachoDto } from './dto/filter-despacho.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EstadoDespacho } from './entities/despacho.entity';

@ApiTags('Producción - Despacho')
@Controller('production/despacho')
export class DespachoController {
  constructor(private readonly despachoService: DespachoService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo despacho' })
  async create(@Body() dto: CreateDespachoDto) {
    return this.despachoService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar despachos con filtros' })
  async findAll(@Query() filter: FilterDespachoDto) {
    return this.despachoService.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener despacho por ID' })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.despachoService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar despacho' })
  async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: UpdateDespachoDto) {
    return this.despachoService.update(id, dto);
  }

  @Patch(':id/estado')
  @ApiOperation({ summary: 'Cambiar estado del despacho' })
  async cambiarEstado(@Param('id', new ParseUUIDPipe()) id: string, @Body('estado') estado: EstadoDespacho) {
    return this.despachoService.cambiarEstado(id, estado);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar despacho' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.despachoService.remove(id);
  }
}
