import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ProcesosService } from './procesos.service';
import { CreateProcesoDto } from './dto/create-proceso.dto';
import { UpdateProcesoDto } from './dto/update-proceso.dto';
import { FilterProcesoDto } from './dto/filter-proceso.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Procesos')
@Controller('procesos')
export class ProcesosController {
  constructor(private readonly procesosService: ProcesosService) {}

  /**
   * Crear un nuevo proceso
   * POST /procesos
   */
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo proceso' })
  @ApiResponse({ status: 201, description: 'Proceso creado exitosamente' })
  @ApiResponse({ status: 409, description: 'Ya existe un proceso con ese código' })
  async create(@Body() dto: CreateProcesoDto) {
    return this.procesosService.create(dto);
  }

  /**
   * Listar procesos con filtros y paginación
   * GET /procesos?search=&tipo=&estado=&page=&limit=
   */
  @Get()
  @ApiOperation({ summary: 'Listar todos los procesos con filtros' })
  @ApiResponse({ status: 200, description: 'Lista de procesos' })
  async findAll(@Query() filter: FilterProcesoDto) {
    return this.procesosService.findAll(filter);
  }

  /**
   * Obtener estadísticas por tipo
   * GET /procesos/estadisticas/por-tipo
   */
  @Get('estadisticas/por-tipo')
  @ApiOperation({ summary: 'Obtener estadísticas de procesos por tipo' })
  @ApiResponse({ status: 200, description: 'Estadísticas por tipo' })
  async getEstadisticasPorTipo() {
    return this.procesosService.getEstadisticasPorTipo();
  }

  /**
   * Obtener un proceso por ID
   * GET /procesos/:id
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un proceso por ID' })
  @ApiResponse({ status: 200, description: 'Proceso encontrado' })
  @ApiResponse({ status: 404, description: 'Proceso no encontrado' })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.procesosService.findOne(id);
  }

  /**
   * Obtener un proceso por código
   * GET /procesos/codigo/:codigo
   */
  @Get('codigo/:codigo')
  @ApiOperation({ summary: 'Obtener un proceso por código' })
  @ApiResponse({ status: 200, description: 'Proceso encontrado' })
  @ApiResponse({ status: 404, description: 'Proceso no encontrado' })
  async findByCodigo(@Param('codigo') codigo: string) {
    return this.procesosService.findByCodigo(codigo);
  }

  /**
   * Obtener procesos por ruta
   * GET /procesos/ruta/:rutaId
   */
  @Get('ruta/:rutaId')
  @ApiOperation({ summary: 'Obtener procesos por ruta de producción' })
  @ApiResponse({ status: 200, description: 'Lista de procesos de la ruta' })
  async findByRuta(@Param('rutaId', new ParseUUIDPipe()) rutaId: string) {
    return this.procesosService.findByRuta(rutaId);
  }

  /**
   * Obtener procesos por producto
   * GET /procesos/producto/:productoId
   */
  @Get('producto/:productoId')
  @ApiOperation({ summary: 'Obtener procesos por producto' })
  @ApiResponse({ status: 200, description: 'Lista de procesos del producto' })
  async findByProducto(@Param('productoId', new ParseUUIDPipe()) productoId: string) {
    return this.procesosService.findByProducto(productoId);
  }

  /**
   * Obtener procesos por centro de trabajo
   * GET /procesos/work-center/:workCenterId
   */
  @Get('work-center/:workCenterId')
  @ApiOperation({ summary: 'Obtener procesos por centro de trabajo' })
  @ApiResponse({ status: 200, description: 'Lista de procesos del centro de trabajo' })
  async findByWorkCenter(@Param('workCenterId', new ParseUUIDPipe()) workCenterId: string) {
    return this.procesosService.findByWorkCenter(workCenterId);
  }

  /**
   * Obtener procesos hijos
   * GET /procesos/:id/hijos
   */
  @Get(':id/hijos')
  @ApiOperation({ summary: 'Obtener procesos hijos de un proceso padre' })
  @ApiResponse({ status: 200, description: 'Lista de procesos hijos' })
  async findHijos(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.procesosService.findHijos(id);
  }

  /**
   * Duplicar un proceso
   * POST /procesos/:id/duplicar
   */
  @Post(':id/duplicar')
  @ApiOperation({ summary: 'Duplicar un proceso existente' })
  @ApiResponse({ status: 201, description: 'Proceso duplicado' })
  async duplicar(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('nuevoCodigo') nuevoCodigo: string,
  ) {
    return this.procesosService.duplicar(id, nuevoCodigo);
  }

  /**
   * Actualizar un proceso
   * PATCH /procesos/:id
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un proceso' })
  @ApiResponse({ status: 200, description: 'Proceso actualizado' })
  @ApiResponse({ status: 404, description: 'Proceso no encontrado' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateProcesoDto,
  ) {
    return this.procesosService.update(id, dto);
  }

  /**
   * Cambiar estado de un proceso
   * PATCH /procesos/:id/estado/:estado
   */
  @Patch(':id/estado/:estado')
  @ApiOperation({ summary: 'Cambiar estado de un proceso' })
  @ApiParam({ name: 'estado', enum: ['ACTIVO', 'INACTIVO', 'EN_REVISION', 'OBSOLETO'] })
  @ApiResponse({ status: 200, description: 'Estado del proceso actualizado' })
  async cambiarEstado(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('estado') estado: string,
  ) {
    return this.procesosService.cambiarEstado(id, estado);
  }

  /**
   * Eliminar un proceso (soft delete)
   * DELETE /procesos/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un proceso (soft delete)' })
  @ApiResponse({ status: 204, description: 'Proceso eliminado' })
  @ApiResponse({ status: 404, description: 'Proceso no encontrado' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.procesosService.remove(id);
  }

  /**
   * Restaurar un proceso eliminado
   * PATCH /procesos/:id/restore
   */
  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restaurar un proceso eliminado' })
  @ApiResponse({ status: 200, description: 'Proceso restaurado' })
  async restore(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.procesosService.restore(id);
  }
}
