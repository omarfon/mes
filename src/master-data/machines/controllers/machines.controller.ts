import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, HttpStatus, HttpCode } from '@nestjs/common';
import { CreateMachineDto } from '../dtos/create-machine.dto';

import { MachinesService } from '../services/machines.service';
import { FilterMachinesDto } from '../dtos/filter-machine.dto';
import { UpdateMachineDto } from '../dtos/update-machine.dto';


@Controller('machines')
export class MachinesController {
  constructor(private readonly machinesService: MachinesService) {}

  /**
   * Crear nueva máquina
   * POST /machines
   */
  @Post()
  async create(@Body() dto: CreateMachineDto) {
    // Devuelve la máquina creada
    return this.machinesService.create(dto);
  }

  /**
   * Listar máquinas (con filtros/paginación)
   * GET /machines?workCenterId=&status=&page=&limit=&search=
   */
  @Get()
  async findAll(@Query() filter: FilterMachinesDto) {
    return this.machinesService.findAll(filter);
  }

  /**
   * Obtener una máquina por ID
   * GET /machines/:id
   */
  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.machinesService.findOne(id);
  }

  /**
   * Actualizar una máquina
   * PATCH /machines/:id
   */
  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateMachineDto,
  ) {
    return this.machinesService.update(id, dto);
  }

  /**
   * Cambiar solo el estado de la máquina (opcional pero muy útil en MES)
   * PATCH /machines/:id/status
   */
  @Patch(':id/status')
  async updateStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('status') status: string,
  ) {
    return this.machinesService.updateStatus(id, status);
  }

  /**
   * Eliminar máquina (podrías implementar soft delete en el service)
   * DELETE /machines/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.machinesService.remove(id);
  }
}



