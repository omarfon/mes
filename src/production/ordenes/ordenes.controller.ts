import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { OrdenesService } from './ordenes.service';
import { CreateOrdenDto } from './dto/create-orden.dto';
import { UpdateOrdenDto } from './dto/update-orden.dto';
import { FilterOrdenDto } from './dto/filter-orden.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EstadoOrden } from './entities/orden.entity';

@ApiTags('Producción - Órdenes')
@Controller('production/ordenes')
export class OrdenesController {
  constructor(private readonly ordenesService: OrdenesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva orden de producción' })
  @ApiResponse({ status: 201, description: 'Orden creada exitosamente' })
  async create(@Body() dto: CreateOrdenDto) {
    return this.ordenesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las órdenes con filtros' })
  @ApiResponse({ status: 200, description: 'Lista de órdenes' })
  async findAll(@Query() filter: FilterOrdenDto) {
    return this.ordenesService.findAll(filter);
  }

  @Get('estadisticas')
  @ApiOperation({ summary: 'Obtener estadísticas de órdenes' })
  @ApiResponse({ status: 200, description: 'Estadísticas generales' })
  async getEstadisticas() {
    return this.ordenesService.getEstadisticas();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una orden por ID' })
  @ApiResponse({ status: 200, description: 'Orden encontrada' })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.ordenesService.findOne(id);
  }

  @Get('numero/:numeroOrden')
  @ApiOperation({ summary: 'Obtener una orden por número' })
  @ApiResponse({ status: 200, description: 'Orden encontrada' })
  async findByNumero(@Param('numeroOrden') numeroOrden: string) {
    return this.ordenesService.findByNumero(numeroOrden);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una orden' })
  @ApiResponse({ status: 200, description: 'Orden actualizada' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateOrdenDto,
  ) {
    return this.ordenesService.update(id, dto);
  }

  @Patch(':id/estado')
  @ApiOperation({ summary: 'Cambiar estado de la orden' })
  @ApiResponse({ status: 200, description: 'Estado actualizado' })
  async cambiarEstado(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('estado') estado: EstadoOrden,
  ) {
    return this.ordenesService.cambiarEstado(id, estado);
  }

  @Patch(':id/produccion')
  @ApiOperation({ summary: 'Registrar cantidad producida' })
  @ApiResponse({ status: 200, description: 'Producción registrada' })
  async registrarProduccion(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('cantidad') cantidad: number,
  ) {
    return this.ordenesService.registrarProduccion(id, cantidad);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar orden (soft delete)' })
  @ApiResponse({ status: 200, description: 'Orden eliminada' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.ordenesService.remove(id);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restaurar orden eliminada' })
  @ApiResponse({ status: 200, description: 'Orden restaurada' })
  async restore(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.ordenesService.restore(id);
  }
}
