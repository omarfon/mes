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
import { OperadoresService } from './operadores.service';
import { CreateOperadorDto } from './dto/create-operador.dto';
import { UpdateOperadorDto } from './dto/update-operador.dto';
import { FilterOperadorDto } from './dto/filter-operador.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Operadores')
@Controller('operadores')
export class OperadoresController {
  constructor(private readonly operadoresService: OperadoresService) {}

  /**
   * Crear un nuevo operador
   * POST /operadores
   */
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo operador' })
  @ApiResponse({ status: 201, description: 'Operador creado exitosamente' })
  @ApiResponse({ status: 409, description: 'Ya existe un operador con ese código o número de empleado' })
  async create(@Body() dto: CreateOperadorDto) {
    return this.operadoresService.create(dto);
  }

  /**
   * Listar operadores con filtros y paginación
   * GET /operadores?search=&estado=&nivelHabilidad=&page=&limit=
   */
  @Get()
  @ApiOperation({ summary: 'Listar todos los operadores con filtros' })
  @ApiResponse({ status: 200, description: 'Lista de operadores' })
  async findAll(@Query() filter: FilterOperadorDto) {
    return this.operadoresService.findAll(filter);
  }

  /**
   * Obtener un operador por ID
   * GET /operadores/:id
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un operador por ID' })
  @ApiResponse({ status: 200, description: 'Operador encontrado' })
  @ApiResponse({ status: 404, description: 'Operador no encontrado' })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.operadoresService.findOne(id);
  }

  /**
   * Obtener un operador por código
   * GET /operadores/codigo/:codigo
   */
  @Get('codigo/:codigo')
  @ApiOperation({ summary: 'Obtener un operador por código' })
  @ApiResponse({ status: 200, description: 'Operador encontrado' })
  @ApiResponse({ status: 404, description: 'Operador no encontrado' })
  async findByCodigo(@Param('codigo') codigo: string) {
    return this.operadoresService.findByCodigo(codigo);
  }

  /**
   * Obtener un operador por número de empleado
   * GET /operadores/empleado/:numeroEmpleado
   */
  @Get('empleado/:numeroEmpleado')
  @ApiOperation({ summary: 'Obtener un operador por número de empleado' })
  @ApiResponse({ status: 200, description: 'Operador encontrado' })
  @ApiResponse({ status: 404, description: 'Operador no encontrado' })
  async findByNumeroEmpleado(@Param('numeroEmpleado') numeroEmpleado: string) {
    return this.operadoresService.findByNumeroEmpleado(numeroEmpleado);
  }

  /**
   * Obtener operadores por turno
   * GET /operadores/turno/:turnoId
   */
  @Get('turno/:turnoId')
  @ApiOperation({ summary: 'Obtener operadores por turno' })
  @ApiResponse({ status: 200, description: 'Lista de operadores del turno' })
  async findByTurno(@Param('turnoId', new ParseUUIDPipe()) turnoId: string) {
    return this.operadoresService.findByTurno(turnoId);
  }

  /**
   * Obtener operadores supervisados
   * GET /operadores/supervisor/:supervisorId
   */
  @Get('supervisor/:supervisorId')
  @ApiOperation({ summary: 'Obtener operadores supervisados por un supervisor' })
  @ApiResponse({ status: 200, description: 'Lista de operadores supervisados' })
  async findBySupervisor(@Param('supervisorId', new ParseUUIDPipe()) supervisorId: string) {
    return this.operadoresService.findBySupervisor(supervisorId);
  }

  /**
   * Actualizar un operador
   * PATCH /operadores/:id
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un operador' })
  @ApiResponse({ status: 200, description: 'Operador actualizado' })
  @ApiResponse({ status: 404, description: 'Operador no encontrado' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateOperadorDto,
  ) {
    return this.operadoresService.update(id, dto);
  }

  /**
   * Cambiar estado de un operador
   * PATCH /operadores/:id/estado/:estado
   */
  @Patch(':id/estado/:estado')
  @ApiOperation({ summary: 'Cambiar estado de un operador' })
  @ApiParam({ name: 'estado', enum: ['ACTIVO', 'INACTIVO', 'VACACIONES', 'BAJA_TEMPORAL', 'BAJA_DEFINITIVA'] })
  @ApiResponse({ status: 200, description: 'Estado del operador actualizado' })
  async cambiarEstado(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('estado') estado: string,
  ) {
    return this.operadoresService.cambiarEstado(id, estado);
  }

  /**
   * Asignar máquina a operador
   * PATCH /operadores/:id/maquinas/:maquinaId
   */
  @Patch(':id/maquinas/:maquinaId')
  @ApiOperation({ summary: 'Asignar máquina autorizada a operador' })
  @ApiResponse({ status: 200, description: 'Máquina asignada' })
  async asignarMaquina(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('maquinaId', new ParseUUIDPipe()) maquinaId: string,
  ) {
    return this.operadoresService.asignarMaquina(id, maquinaId);
  }

  /**
   * Remover máquina de operador
   * DELETE /operadores/:id/maquinas/:maquinaId
   */
  @Delete(':id/maquinas/:maquinaId')
  @ApiOperation({ summary: 'Remover máquina autorizada de operador' })
  @ApiResponse({ status: 200, description: 'Máquina removida' })
  async removerMaquina(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('maquinaId', new ParseUUIDPipe()) maquinaId: string,
  ) {
    return this.operadoresService.removerMaquina(id, maquinaId);
  }

  /**
   * Eliminar un operador (soft delete)
   * DELETE /operadores/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un operador (soft delete)' })
  @ApiResponse({ status: 204, description: 'Operador eliminado' })
  @ApiResponse({ status: 404, description: 'Operador no encontrado' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.operadoresService.remove(id);
  }

  /**
   * Restaurar un operador eliminado
   * PATCH /operadores/:id/restore
   */
  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restaurar un operador eliminado' })
  @ApiResponse({ status: 200, description: 'Operador restaurado' })
  async restore(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.operadoresService.restore(id);
  }
}
