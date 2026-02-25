import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SparePartsService } from './spare-parts.service';

@ApiTags('Maintenance Spare Parts')
@Controller('maintenance/spare-parts')
export class SparePartsController {
  constructor(private readonly sparePartsService: SparePartsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo repuesto' })
  create(@Body() createSparePartDto: any) {
    return this.sparePartsService.create(createSparePartDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar repuestos' })
  findAll(@Query() filters: any) {
    return this.sparePartsService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener repuesto por ID' })
  findOne(@Param('id') id: string) {
    return this.sparePartsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar repuesto' })
  update(@Param('id') id: string, @Body() updateSparePartDto: any) {
    return this.sparePartsService.update(id, updateSparePartDto);
  }

  @Patch(':id/stock')
  @ApiOperation({ summary: 'Actualizar stock de repuesto' })
  updateStock(@Param('id') id: string, @Body('quantity') quantity: number) {
    return this.sparePartsService.updateStock(id, quantity);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar repuesto' })
  remove(@Param('id') id: string) {
    return this.sparePartsService.remove(id);
  }
}
