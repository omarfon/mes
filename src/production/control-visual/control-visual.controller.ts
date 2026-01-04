// src/production/control-visual/control-visual.controller.ts
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
import { ControlVisualService } from './control-visual.service';
import { CreateControlVisualDto } from './dto/create-control-visual.dto';
import { UpdateControlVisualDto } from './dto/update-control-visual.dto';
import { FilterControlVisualDto } from './dto/filter-control-visual.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TipoAlerta } from './entities/control-visual.entity';
import { MachinesService } from '../../master-data/machines/services/machines.service';
import { WorkCentersService } from '../../master-data/work-centers/work-centers.service';
import { MachineStatus } from 'src/master-data/machines/entities/machines.entity';

@ApiTags('Producción - Control Visual')
@Controller('production/control-visual')
export class ControlVisualController {
  constructor(
    private readonly controlVisualService: ControlVisualService,
    private readonly machinesService: MachinesService,
    private readonly workCentersService: WorkCentersService,
  ) {}

  @Get('recursos-disponibles')
  @ApiOperation({ summary: 'Obtener máquinas y centros de trabajo disponibles' })
  @ApiResponse({ status: 200, description: 'Recursos obtenidos' })
  async getRecursosDisponibles() {
    const [maquinas, workCenters] = await Promise.all([
      this.machinesService.findAll({ page: 1, limit: 100, status: MachineStatus.ACTIVE }),
      this.workCentersService.findAll({ page: 1, limit: 100, isActive: true }),
    ]);

    return {
      maquinas: maquinas.data.map(m => ({
        id: m.id,
        codigo: m.code,
        nombre: m.name,
        tipo: m.type,
        area: m.area,
      })),
      workCenters: workCenters.data.map(wc => ({
        id: wc.id,
        codigo: wc.code,
        nombre: wc.name,
        tipo: wc.type,
      })),
    };
  }

  @Get('tablero')
  @ApiOperation({ summary: 'Obtener tablero visual completo' })
  @ApiResponse({ status: 200, description: 'Tablero obtenido' })
  async getTablero() {
    return this.controlVisualService.getTablero();
  }

  @Get('alertas')
  @ApiOperation({ summary: 'Obtener todas las alertas activas' })
  @ApiResponse({ status: 200, description: 'Alertas obtenidas' })
  async getAlertas() {
    return this.controlVisualService.getAlertas();
  }

  @Post()
  @ApiOperation({ summary: 'Crear nuevo control visual' })
  @ApiResponse({ status: 201, description: 'Control visual creado' })
  async create(@Body() dto: CreateControlVisualDto) {
    return this.controlVisualService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar controles visuales con filtros' })
  @ApiResponse({ status: 200, description: 'Lista obtenida' })
  async findAll(@Query() filter: FilterControlVisualDto) {
    return this.controlVisualService.findAll(filter);
  }

  @Get('maquina/:maquinaId')
  @ApiOperation({ summary: 'Obtener controles por máquina' })
  @ApiResponse({ status: 200, description: 'Controles encontrados' })
  async findByMaquina(@Param('maquinaId', new ParseUUIDPipe()) maquinaId: string) {
    return this.controlVisualService.findByMaquina(maquinaId);
  }

  @Get('work-center/:workCenterId')
  @ApiOperation({ summary: 'Obtener controles por centro de trabajo' })
  @ApiResponse({ status: 200, description: 'Controles encontrados' })
  async findByWorkCenter(@Param('workCenterId', new ParseUUIDPipe()) workCenterId: string) {
    return this.controlVisualService.findByWorkCenter(workCenterId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener control visual por ID' })
  @ApiResponse({ status: 200, description: 'Control encontrado' })
  @ApiResponse({ status: 404, description: 'Control no encontrado' })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.controlVisualService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar control visual' })
  @ApiResponse({ status: 200, description: 'Control actualizado' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateControlVisualDto,
  ) {
    return this.controlVisualService.update(id, dto);
  }

  @Patch(':id/activar-alerta')
  @ApiOperation({ summary: 'Activar alerta en control visual' })
  @ApiResponse({ status: 200, description: 'Alerta activada' })
  async activarAlerta(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('tipoAlerta') tipoAlerta: TipoAlerta,
    @Body('mensaje') mensaje: string,
  ) {
    return this.controlVisualService.activarAlerta(id, tipoAlerta, mensaje);
  }

  @Patch(':id/desactivar-alerta')
  @ApiOperation({ summary: 'Desactivar alerta' })
  @ApiResponse({ status: 200, description: 'Alerta desactivada' })
  async desactivarAlerta(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.controlVisualService.desactivarAlerta(id);
  }

  @Patch(':id/metricas')
  @ApiOperation({ summary: 'Actualizar métricas' })
  @ApiResponse({ status: 200, description: 'Métricas actualizadas' })
  async actualizarMetricas(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() metricas: any,
  ) {
    return this.controlVisualService.actualizarMetricas(id, metricas);
  }

  @Patch(':id/desactivar')
  @ApiOperation({ summary: 'Desactivar control visual' })
  @ApiResponse({ status: 200, description: 'Control desactivado' })
  async desactivar(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.controlVisualService.desactivar(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar control visual' })
  @ApiResponse({ status: 200, description: 'Control eliminado' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.controlVisualService.remove(id);
  }
}