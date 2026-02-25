import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PreventiveMaintenanceService } from './preventive-maintenance.service';

@ApiTags('Preventive Maintenance')
@Controller('maintenance/preventive')
export class PreventiveMaintenanceController {
  constructor(private readonly preventiveMaintenanceService: PreventiveMaintenanceService) {}

  @Post()
  @ApiOperation({ summary: 'Crear plan de mantenimiento preventivo' })
  create(@Body() createPlanDto: any) {
    return this.preventiveMaintenanceService.create(createPlanDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar planes preventivos' })
  findAll(@Query() filters: any) {
    return this.preventiveMaintenanceService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener plan preventivo por ID' })
  findOne(@Param('id') id: string) {
    return this.preventiveMaintenanceService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar plan preventivo' })
  update(@Param('id') id: string, @Body() updatePlanDto: any) {
    return this.preventiveMaintenanceService.update(id, updatePlanDto);
  }

  @Post(':id/execute')
  @ApiOperation({ summary: 'Ejecutar mantenimiento preventivo' })
  execute(@Param('id') id: string) {
    return this.preventiveMaintenanceService.executePreventiveMaintenance(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar plan preventivo' })
  remove(@Param('id') id: string) {
    return this.preventiveMaintenanceService.remove(id);
  }
}
