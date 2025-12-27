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
import { MotivosParadaService } from './motivos-parada.service';
import { CreateMotivoParadaDto } from './dto/create-motivo-parada.dto';
import { UpdateMotivoParadaDto } from './dto/update-motivo-parada.dto';
import { FilterMotivoParadaDto } from './dto/filter-motivo-parada.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Motivos de Parada')
@Controller('motivos-parada')
export class MotivosParadaController {
  constructor(private readonly motivosParadaService: MotivosParadaService) {}

  /**
   * Crear un nuevo motivo de parada
   * POST /motivos-parada
   */
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo motivo de parada' })
  @ApiResponse({ status: 201, description: 'Motivo de parada creado exitosamente' })
  @ApiResponse({ status: 409, description: 'Ya existe un motivo con ese código' })
  async create(@Body() dto: CreateMotivoParadaDto) {
    return this.motivosParadaService.create(dto);
  }

  /**
   * Listar motivos de parada con filtros y paginación
   * GET /motivos-parada?search=&categoria=&tipo=&activo=&page=&limit=
   */
  @Get()
  @ApiOperation({ summary: 'Listar todos los motivos de parada con filtros' })
  @ApiResponse({ status: 200, description: 'Lista de motivos de parada' })
  async findAll(@Query() filter: FilterMotivoParadaDto) {
    return this.motivosParadaService.findAll(filter);
  }

  /**
   * Obtener estadísticas por categoría
   * GET /motivos-parada/estadisticas/por-categoria
   */
  @Get('estadisticas/por-categoria')
  @ApiOperation({ summary: 'Obtener estadísticas de motivos por categoría' })
  @ApiResponse({ status: 200, description: 'Estadísticas por categoría' })
  async getEstadisticasPorCategoria() {
    return this.motivosParadaService.getEstadisticasPorCategoria();
  }

  /**
   * Obtener un motivo de parada por ID
   * GET /motivos-parada/:id
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un motivo de parada por ID' })
  @ApiResponse({ status: 200, description: 'Motivo de parada encontrado' })
  @ApiResponse({ status: 404, description: 'Motivo de parada no encontrado' })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.motivosParadaService.findOne(id);
  }

  /**
   * Obtener un motivo de parada por código
   * GET /motivos-parada/codigo/:codigo
   */
  @Get('codigo/:codigo')
  @ApiOperation({ summary: 'Obtener un motivo de parada por código' })
  @ApiResponse({ status: 200, description: 'Motivo de parada encontrado' })
  @ApiResponse({ status: 404, description: 'Motivo de parada no encontrado' })
  async findByCodigo(@Param('codigo') codigo: string) {
    return this.motivosParadaService.findByCodigo(codigo);
  }

  /**
   * Obtener motivos por categoría
   * GET /motivos-parada/categoria/:categoria
   */
  @Get('categoria/:categoria')
  @ApiOperation({ summary: 'Obtener motivos de parada por categoría' })
  @ApiResponse({ status: 200, description: 'Lista de motivos de la categoría' })
  async findByCategoria(@Param('categoria') categoria: string) {
    return this.motivosParadaService.findByCategoria(categoria);
  }

  /**
   * Obtener motivos hijos de un motivo padre
   * GET /motivos-parada/:id/hijos
   */
  @Get(':id/hijos')
  @ApiOperation({ summary: 'Obtener motivos hijos de un motivo padre' })
  @ApiResponse({ status: 200, description: 'Lista de motivos hijos' })
  async findHijos(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.motivosParadaService.findHijos(id);
  }

  /**
   * Actualizar un motivo de parada
   * PATCH /motivos-parada/:id
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un motivo de parada' })
  @ApiResponse({ status: 200, description: 'Motivo de parada actualizado' })
  @ApiResponse({ status: 404, description: 'Motivo de parada no encontrado' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateMotivoParadaDto,
  ) {
    return this.motivosParadaService.update(id, dto);
  }

  /**
   * Activar/desactivar un motivo de parada
   * PATCH /motivos-parada/:id/toggle-active
   */
  @Patch(':id/toggle-active')
  @ApiOperation({ summary: 'Activar o desactivar un motivo de parada' })
  @ApiResponse({ status: 200, description: 'Estado del motivo actualizado' })
  async toggleActive(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.motivosParadaService.toggleActive(id);
  }

  /**
   * Eliminar un motivo de parada (soft delete)
   * DELETE /motivos-parada/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un motivo de parada (soft delete)' })
  @ApiResponse({ status: 204, description: 'Motivo de parada eliminado' })
  @ApiResponse({ status: 404, description: 'Motivo de parada no encontrado' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.motivosParadaService.remove(id);
  }

  /**
   * Restaurar un motivo de parada eliminado
   * PATCH /motivos-parada/:id/restore
   */
  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restaurar un motivo de parada eliminado' })
  @ApiResponse({ status: 200, description: 'Motivo de parada restaurado' })
  async restore(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.motivosParadaService.restore(id);
  }
}
