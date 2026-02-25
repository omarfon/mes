import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DowntimeService } from './downtime.service';

@ApiTags('Maintenance Downtime')
@Controller('maintenance/downtime')
export class DowntimeController {
  constructor(private readonly downtimeService: DowntimeService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar nueva parada' })
  create(@Body() createDowntimeDto: any) {
    return this.downtimeService.create(createDowntimeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar paradas' })
  findAll(@Query() filters: any) {
    return this.downtimeService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener parada por ID' })
  findOne(@Param('id') id: string) {
    return this.downtimeService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar parada' })
  update(@Param('id') id: string, @Body() updateDowntimeDto: any) {
    return this.downtimeService.update(id, updateDowntimeDto);
  }

  @Patch(':id/end')
  @ApiOperation({ summary: 'Finalizar parada' })
  endDowntime(@Param('id') id: string) {
    return this.downtimeService.endDowntime(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar parada' })
  remove(@Param('id') id: string) {
    return this.downtimeService.remove(id);
  }
}
