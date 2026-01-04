// ejecucion.controller.ts
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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EjecucionService } from './ejecucion.service';
import { CreateEjecucionDto } from './dto/create-ejecucion.dto';
import { UpdateEjecucionDto } from './dto/update-ejecucion.dto';
import { FilterEjecucionDto } from './dto/filter-ejecucion.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EstadoEjecucion } from './entities/ejecucion.entity';
import { MachinesService } from '../../master-data/machines/services/machines.service';

import { OperadoresService } from '../../master-data/operadores/operadores.service';
import { EstadoOperador } from '../../master-data/operadores/entities/operador.entity';
import { MachineStatus } from 'src/master-data/machines/entities/machines.entity';

@ApiTags('Producción - Ejecución')
@Controller('production/ejecucion')
export class EjecucionController {
  constructor(
    private readonly ejecucionService: EjecucionService,
    private readonly machinesService: MachinesService,
    private readonly operadoresService: OperadoresService,
  ) {}

  @Get('recursos-disponibles')
  @ApiOperation({ summary: 'Obtener máquinas y operadores disponibles para crear ejecución' })
  @ApiResponse({ status: 200, description: 'Recursos disponibles obtenidos' })
  async getRecursosDisponibles() {
    const [maquinas, operadores] = await Promise.all([
      this.machinesService.findAll({ page: 1, limit: 100, status: MachineStatus.ACTIVE }),
      this.operadoresService.findAll({ page: 1, limit: 100, estado: EstadoOperador.ACTIVO }),
    ]);

    return {
      maquinas: maquinas.data.map(m => ({
        id: m.id,
        codigo: m.code,
        nombre: m.name,
        tipo: m.type,
        area: m.area,
      })),
      operadores: operadores.data.map(o => ({
        id: o.id,
        codigo: o.codigo,
        nombre: o.nombre,
        nivelHabilidad: o.nivelHabilidad,
        turno: o.turnoId,
      })),
    };
  }

  @Post()
  @ApiOperation({ summary: 'Crear nueva ejecución' })
  @ApiResponse({ status: 201, description: 'Ejecución creada exitosamente' })
  async create(@Body() dto: CreateEjecucionDto) {
    return this.ejecucionService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar ejecuciones con filtros' })
  @ApiResponse({ status: 200, description: 'Lista obtenida exitosamente' })
  async findAll(@Query() filter: FilterEjecucionDto) {
    return this.ejecucionService.findAll(filter);
  }

  @Get('orden/:ordenId')
  @ApiOperation({ summary: 'Obtener ejecuciones por orden' })
  @ApiResponse({ status: 200, description: 'Ejecuciones encontradas' })
  async findByOrden(@Param('ordenId', new ParseUUIDPipe()) ordenId: string) {
    return this.ejecucionService.findByOrden(ordenId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener ejecución por ID' })
  @ApiResponse({ status: 200, description: 'Ejecución encontrada' })
  @ApiResponse({ status: 404, description: 'Ejecución no encontrada' })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.ejecucionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar ejecución' })
  @ApiResponse({ status: 200, description: 'Ejecución actualizada' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateEjecucionDto,
  ) {
    return this.ejecucionService.update(id, dto);
  }

  @Patch(':id/estado')
  @ApiOperation({ summary: 'Cambiar estado de ejecución' })
  @ApiResponse({ status: 200, description: 'Estado actualizado' })
  async cambiarEstado(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('estado') estado: EstadoEjecucion,
  ) {
    return this.ejecucionService.cambiarEstado(id, estado);
  }

  @Patch(':id/produccion')
  @ApiOperation({ summary: 'Registrar cantidad producida' })
  @ApiResponse({ status: 200, description: 'Producción registrada' })
  async registrarProduccion(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('cantidad') cantidad: number,
  ) {
    return this.ejecucionService.registrarProduccion(id, cantidad);
  }

  @Patch(':id/rechazo')
  @ApiOperation({ summary: 'Registrar cantidad rechazada' })
  @ApiResponse({ status: 200, description: 'Rechazo registrado' })
  async registrarRechazo(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('cantidad') cantidad: number,
  ) {
    return this.ejecucionService.registrarRechazo(id, cantidad);
  }

  @Patch(':id/parada')
  @ApiOperation({ summary: 'Registrar parada' })
  @ApiResponse({ status: 200, description: 'Parada registrada' })
  async registrarParada(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() parada: any,
  ) {
    return this.ejecucionService.registrarParada(id, parada);
  }

  @Patch(':id/finalizar')
  @ApiOperation({ summary: 'Finalizar ejecución' })
  @ApiResponse({ status: 200, description: 'Ejecución finalizada' })
  async finalizar(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.ejecucionService.finalizarEjecucion(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar ejecución' })
  @ApiResponse({ status: 200, description: 'Ejecución eliminada' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.ejecucionService.remove(id);
  }
}