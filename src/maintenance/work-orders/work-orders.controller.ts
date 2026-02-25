import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { WorkOrdersService } from './work-orders.service';

@ApiTags('Maintenance Work Orders')
@Controller('maintenance/work-orders')
export class WorkOrdersController {
  constructor(private readonly workOrdersService: WorkOrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva orden de trabajo' })
  create(@Body() createWorkOrderDto: any) {
    return this.workOrdersService.create(createWorkOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar órdenes de trabajo' })
  findAll(@Query() filters: any) {
    return this.workOrdersService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener orden de trabajo por ID' })
  findOne(@Param('id') id: string) {
    return this.workOrdersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar orden de trabajo' })
  update(@Param('id') id: string, @Body() updateWorkOrderDto: any) {
    return this.workOrdersService.update(id, updateWorkOrderDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Cambiar estado de orden de trabajo' })
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.workOrdersService.updateStatus(id, status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar orden de trabajo' })
  remove(@Param('id') id: string) {
    return this.workOrdersService.remove(id);
  }
}
