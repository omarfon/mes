import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AssetsService } from './assets.service';

@ApiTags('Maintenance Assets')
@Controller('maintenance/assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo activo/máquina' })
  create(@Body() createAssetDto: any) {
    return this.assetsService.create(createAssetDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar activos/máquinas' })
  findAll(@Query() filters: any) {
    return this.assetsService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener activo/máquina por ID' })
  findOne(@Param('id') id: string) {
    return this.assetsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar activo/máquina' })
  update(@Param('id') id: string, @Body() updateAssetDto: any) {
    return this.assetsService.update(id, updateAssetDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar activo/máquina' })
  remove(@Param('id') id: string) {
    return this.assetsService.remove(id);
  }
}
