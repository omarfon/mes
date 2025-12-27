import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UnidadesMedidaService } from './unidades-medida.service';
import { CreateUnidadMedidaDto } from './dto/create-unidad-medida.dto';
import { UpdateUnidadMedidaDto } from './dto/update-unidad-medida.dto';
import { FilterUnidadMedidaDto } from './dto/filter-unidad-medida.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('Unidades de Medida')
@Controller('unidades-medida')
export class UnidadesMedidaController {
  constructor(private readonly unidadesMedidaService: UnidadesMedidaService) {}

  /**
   * Crear una nueva unidad de medida
   * POST /unidades-medida
   */
  @Post()
  @ApiOperation({ summary: 'Crear una nueva unidad de medida' })
  @ApiResponse({ status: 201, description: 'Unidad de medida creada exitosamente' })
  @ApiResponse({ status: 409, description: 'Ya existe una unidad con ese código o símbolo' })
  async create(@Body() dto: CreateUnidadMedidaDto) {
    return this.unidadesMedidaService.create(dto);
  }

  /**
   * Listar unidades de medida con filtros y paginación
   * GET /unidades-medida?search=&tipo=&activo=&esSI=&page=&limit=
   */
  @Get()
  @ApiOperation({ summary: 'Listar todas las unidades de medida con filtros' })
  @ApiResponse({ status: 200, description: 'Lista de unidades de medida' })
  async findAll(@Query() filter: FilterUnidadMedidaDto) {
    return this.unidadesMedidaService.findAll(filter);
  }

  /**
   * Obtener una unidad de medida por ID
   * GET /unidades-medida/:id
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener una unidad de medida por ID' })
  @ApiResponse({ status: 200, description: 'Unidad de medida encontrada' })
  @ApiResponse({ status: 404, description: 'Unidad de medida no encontrada' })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.unidadesMedidaService.findOne(id);
  }

  /**
   * Obtener una unidad de medida por código
   * GET /unidades-medida/codigo/:codigo
   */
  @Get('codigo/:codigo')
  @ApiOperation({ summary: 'Obtener una unidad de medida por código' })
  @ApiResponse({ status: 200, description: 'Unidad de medida encontrada' })
  @ApiResponse({ status: 404, description: 'Unidad de medida no encontrada' })
  async findByCodigo(@Param('codigo') codigo: string) {
    return this.unidadesMedidaService.findByCodigo(codigo);
  }

  /**
   * Obtener una unidad de medida por símbolo
   * GET /unidades-medida/simbolo/:simbolo
   */
  @Get('simbolo/:simbolo')
  @ApiOperation({ summary: 'Obtener una unidad de medida por símbolo' })
  @ApiResponse({ status: 200, description: 'Unidad de medida encontrada' })
  @ApiResponse({ status: 404, description: 'Unidad de medida no encontrada' })
  async findBySimbolo(@Param('simbolo') simbolo: string) {
    return this.unidadesMedidaService.findBySimbolo(simbolo);
  }

  /**
   * Convertir valor entre unidades
   * GET /unidades-medida/convertir?valor=100&origen=id1&destino=id2
   */
  @Get('convertir/valor')
  @ApiOperation({ summary: 'Convertir valor entre unidades de medida' })
  @ApiQuery({ name: 'valor', type: Number, description: 'Valor a convertir' })
  @ApiQuery({ name: 'origen', type: String, description: 'ID de unidad origen' })
  @ApiQuery({ name: 'destino', type: String, description: 'ID de unidad destino' })
  @ApiResponse({ status: 200, description: 'Valor convertido' })
  async convertir(
    @Query('valor') valor: number,
    @Query('origen') origen: string,
    @Query('destino') destino: string,
  ) {
    const resultado = await this.unidadesMedidaService.convertir(
      Number(valor),
      origen,
      destino,
    );
    return { valor, origen, destino, resultado };
  }

  /**
   * Actualizar una unidad de medida
   * PATCH /unidades-medida/:id
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una unidad de medida' })
  @ApiResponse({ status: 200, description: 'Unidad de medida actualizada' })
  @ApiResponse({ status: 404, description: 'Unidad de medida no encontrada' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateUnidadMedidaDto,
  ) {
    return this.unidadesMedidaService.update(id, dto);
  }

  /**
   * Activar/desactivar una unidad de medida
   * PATCH /unidades-medida/:id/toggle-active
   */
  @Patch(':id/toggle-active')
  @ApiOperation({ summary: 'Activar o desactivar una unidad de medida' })
  @ApiResponse({ status: 200, description: 'Estado de la unidad actualizado' })
  async toggleActive(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.unidadesMedidaService.toggleActive(id);
  }

  /**
   * Eliminar una unidad de medida (soft delete)
   * DELETE /unidades-medida/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una unidad de medida (soft delete)' })
  @ApiResponse({ status: 204, description: 'Unidad de medida eliminada' })
  @ApiResponse({ status: 404, description: 'Unidad de medida no encontrada' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.unidadesMedidaService.remove(id);
  }

  /**
   * Restaurar una unidad de medida eliminada
   * PATCH /unidades-medida/:id/restore
   */
  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restaurar una unidad de medida eliminada' })
  @ApiResponse({ status: 200, description: 'Unidad de medida restaurada' })
  async restore(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.unidadesMedidaService.restore(id);
  }
}
