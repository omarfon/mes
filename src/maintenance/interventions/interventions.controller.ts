import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { InterventionsService } from './interventions.service';

@ApiTags('Maintenance Interventions')
@Controller('maintenance/interventions')
export class InterventionsController {
  constructor(private readonly interventionsService: InterventionsService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar nueva intervención' })
  create(@Body() createInterventionDto: any) {
    return this.interventionsService.create(createInterventionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar intervenciones' })
  findAll(@Query() filters: any) {
    return this.interventionsService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener intervención por ID' })
  findOne(@Param('id') id: string) {
    return this.interventionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar intervención' })
  update(@Param('id') id: string, @Body() updateInterventionDto: any) {
    return this.interventionsService.update(id, updateInterventionDto);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Completar intervención' })
  complete(@Param('id') id: string, @Body() completionData: any) {
    return this.interventionsService.completeIntervention(id, completionData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar intervención' })
  remove(@Param('id') id: string) {
    return this.interventionsService.remove(id);
  }
}
