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
import { TurnosService } from './turnos.service';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';
import { FilterTurnoDto } from './dto/filter-turno.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Turnos')
@Controller('turnos')
export class TurnosController {
  constructor(private readonly turnosService: TurnosService) {}

  /**
   * Crear un nuevo turno
   * POST /turnos
   */
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo turno' })
  @ApiResponse({ status: 201, description: 'Turno creado exitosamente' })
  @ApiResponse({ status: 409, description: 'Ya existe un turno con ese código' })
  async create(@Body() dto: CreateTurnoDto) {
    return this.turnosService.create(dto);
  }

  /**
   * Listar turnos con filtros y paginación
   * GET /turnos?search=&activo=&page=&limit=
   */
  @Get()
  @ApiOperation({ summary: 'Listar todos los turnos con filtros' })
  @ApiResponse({ status: 200, description: 'Lista de turnos' })
  async findAll(@Query() filter: FilterTurnoDto) {
    return this.turnosService.findAll(filter);
  }

  /**
   * Obtener un turno por ID
   * GET /turnos/:id
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un turno por ID' })
  @ApiResponse({ status: 200, description: 'Turno encontrado' })
  @ApiResponse({ status: 404, description: 'Turno no encontrado' })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.turnosService.findOne(id);
  }

  /**
   * Obtener un turno por código
   * GET /turnos/codigo/:codigo
   */
  @Get('codigo/:codigo')
  @ApiOperation({ summary: 'Obtener un turno por código' })
  @ApiResponse({ status: 200, description: 'Turno encontrado' })
  @ApiResponse({ status: 404, description: 'Turno no encontrado' })
  async findByCodigo(@Param('codigo') codigo: string) {
    return this.turnosService.findByCodigo(codigo);
  }

  /**
   * Actualizar un turno
   * PATCH /turnos/:id
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un turno' })
  @ApiResponse({ status: 200, description: 'Turno actualizado' })
  @ApiResponse({ status: 404, description: 'Turno no encontrado' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateTurnoDto,
  ) {
    return this.turnosService.update(id, dto);
  }

  /**
   * Activar/desactivar un turno
   * PATCH /turnos/:id/toggle-active
   */
  @Patch(':id/toggle-active')
  @ApiOperation({ summary: 'Activar o desactivar un turno' })
  @ApiResponse({ status: 200, description: 'Estado del turno actualizado' })
  async toggleActive(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.turnosService.toggleActive(id);
  }

  /**
   * Eliminar un turno (soft delete)
   * DELETE /turnos/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un turno (soft delete)' })
  @ApiResponse({ status: 204, description: 'Turno eliminado' })
  @ApiResponse({ status: 404, description: 'Turno no encontrado' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.turnosService.remove(id);
  }

  /**
   * Restaurar un turno eliminado
   * PATCH /turnos/:id/restore
   */
  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restaurar un turno eliminado' })
  @ApiResponse({ status: 200, description: 'Turno restaurado' })
  async restore(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.turnosService.restore(id);
  }
}
