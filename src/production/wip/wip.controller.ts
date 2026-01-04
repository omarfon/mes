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
import { WIPService } from './wip.service';
import { CreateWIPDto } from './dto/create-wip.dto';
import { UpdateWIPDto } from './dto/update-wip.dto';
import { FilterWIPDto } from './dto/filter-wip.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Producción - WIP (Work In Process)')
@Controller('production/wip')
export class WIPController {
  constructor(private readonly wipService: WIPService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar nuevo WIP' })
  @ApiResponse({ status: 201, description: 'WIP creado exitosamente' })
  async create(@Body() dto: CreateWIPDto) {
    return this.wipService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar WIP con filtros' })
  @ApiResponse({ status: 200, description: 'Lista obtenida exitosamente' })
  async findAll(@Query() filter: FilterWIPDto) {
    return this.wipService.findAll(filter);
  }

  @Get('resumen')
  @ApiOperation({ summary: 'Obtener resumen de WIP por centro de trabajo' })
  @ApiResponse({ status: 200, description: 'Resumen obtenido exitosamente' })
  async getResumen() {
    return this.wipService.getResumen();
  }

  @Get('orden/:ordenId')
  @ApiOperation({ summary: 'Obtener WIP por orden' })
  @ApiResponse({ status: 200, description: 'WIP encontrados' })
  async findByOrden(@Param('ordenId', new ParseUUIDPipe()) ordenId: string) {
    return this.wipService.findByOrden(ordenId);
  }

  @Get('work-center/:workCenterId')
  @ApiOperation({ summary: 'Obtener WIP por centro de trabajo' })
  @ApiResponse({ status: 200, description: 'WIP encontrados' })
  async findByWorkCenter(@Param('workCenterId', new ParseUUIDPipe()) workCenterId: string) {
    return this.wipService.findByWorkCenter(workCenterId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener WIP por ID' })
  @ApiResponse({ status: 200, description: 'WIP encontrado' })
  @ApiResponse({ status: 404, description: 'WIP no encontrado' })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.wipService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar WIP' })
  @ApiResponse({ status: 200, description: 'WIP actualizado' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateWIPDto,
  ) {
    return this.wipService.update(id, dto);
  }

  @Patch(':id/ajustar')
  @ApiOperation({ summary: 'Ajustar cantidad de WIP' })
  @ApiResponse({ status: 200, description: 'Cantidad ajustada' })
  async ajustar(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('cantidad') cantidad: number,
    @Body('motivo') motivo?: string,
  ) {
    return this.wipService.ajustarCantidad(id, cantidad, motivo);
  }

  @Patch(':id/transferir')
  @ApiOperation({ summary: 'Transferir WIP a otro centro de trabajo' })
  @ApiResponse({ status: 200, description: 'WIP transferido' })
  async transferir(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('workCenterId') workCenterId: string,
    @Body('ubicacion') ubicacion?: string,
  ) {
    return this.wipService.transferir(id, workCenterId, ubicacion);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar WIP' })
  @ApiResponse({ status: 200, description: 'WIP eliminado' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.wipService.remove(id);
  }
}