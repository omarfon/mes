// src/traceability/genealogy/genealogy.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Query, 
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { GenealogyService } from './genealogy.service';
import { CreateLotGenealogyDto } from './dto/create-lot-genealogy.dto';

@ApiTags('Traceability - Lot Genealogy')
@Controller('traceability/lot-genealogy')
export class GenealogyController {
  constructor(private readonly genealogyService: GenealogyService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nueva relación genealógica entre lotes' })
  @ApiResponse({ status: 201, description: 'Relación creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o relación circular' })
  async create(@Body() createDto: CreateLotGenealogyDto) {
    return this.genealogyService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las relaciones genealógicas' })
  @ApiResponse({ status: 200, description: 'Lista de relaciones obtenida' })
  async findAll() {
    return this.genealogyService.findAll();
  }

  @Get('lot/:lotId')
  @ApiOperation({ summary: 'Obtener todas las relaciones de un lote específico' })
  @ApiParam({ name: 'lotId', description: 'ID del lote', type: 'string' })
  @ApiResponse({ status: 200, description: 'Relaciones encontradas' })
  @ApiResponse({ status: 404, description: 'Lote no encontrado' })
  async findByLotId(@Param('lotId', new ParseUUIDPipe()) lotId: string) {
    return this.genealogyService.findByLotId(lotId);
  }

  @Get('lot/:lotId/upstream')
  @ApiOperation({ summary: 'Rastrear hacia arriba (materiales de origen)' })
  @ApiParam({ name: 'lotId', description: 'ID del lote', type: 'string' })
  @ApiQuery({ name: 'maxDepth', required: false, type: Number, description: 'Profundidad máxima de búsqueda' })
  @ApiResponse({ status: 200, description: 'Trazabilidad hacia arriba obtenida' })
  async traceUpstream(
    @Param('lotId', new ParseUUIDPipe()) lotId: string,
    @Query('maxDepth') maxDepth?: number,
  ) {
    return this.genealogyService.traceUpstream(
      lotId,
      maxDepth ? parseInt(maxDepth.toString()) : 10,
    );
  }

  @Get('lot/:lotId/downstream')
  @ApiOperation({ summary: 'Rastrear hacia abajo (productos derivados)' })
  @ApiParam({ name: 'lotId', description: 'ID del lote', type: 'string' })
  @ApiQuery({ name: 'maxDepth', required: false, type: Number, description: 'Profundidad máxima de búsqueda' })
  @ApiResponse({ status: 200, description: 'Trazabilidad hacia abajo obtenida' })
  async traceDownstream(
    @Param('lotId', new ParseUUIDPipe()) lotId: string,
    @Query('maxDepth') maxDepth?: number,
  ) {
    return this.genealogyService.traceDownstream(
      lotId,
      maxDepth ? parseInt(maxDepth.toString()) : 10,
    );
  }

  @Get('lot/:lotId/tree')
  @ApiOperation({ summary: 'Obtener árbol genealógico completo (upstream y downstream)' })
  @ApiParam({ name: 'lotId', description: 'ID del lote', type: 'string' })
  @ApiQuery({ name: 'maxDepth', required: false, type: Number, description: 'Profundidad máxima de búsqueda' })
  @ApiResponse({ status: 200, description: 'Árbol genealógico obtenido' })
  async getFullTree(
    @Param('lotId', new ParseUUIDPipe()) lotId: string,
    @Query('maxDepth') maxDepth?: number,
  ) {
    return this.genealogyService.getFullTree(
      lotId,
      maxDepth ? parseInt(maxDepth.toString()) : 10,
    );
  }

  @Get('lot/:lotId/parents')
  @ApiOperation({ summary: 'Obtener lotes padres directos' })
  @ApiParam({ name: 'lotId', description: 'ID del lote', type: 'string' })
  @ApiResponse({ status: 200, description: 'Lotes padres obtenidos' })
  async getParents(@Param('lotId', new ParseUUIDPipe()) lotId: string) {
    return this.genealogyService.getParents(lotId);
  }

  @Get('lot/:lotId/children')
  @ApiOperation({ summary: 'Obtener lotes hijos directos' })
  @ApiParam({ name: 'lotId', description: 'ID del lote', type: 'string' })
  @ApiResponse({ status: 200, description: 'Lotes hijos obtenidos' })
  async getChildren(@Param('lotId', new ParseUUIDPipe()) lotId: string) {
    return this.genealogyService.getChildren(lotId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener relación genealógica por ID' })
  @ApiParam({ name: 'id', description: 'ID de la relación', type: 'string' })
  @ApiResponse({ status: 200, description: 'Relación encontrada' })
  @ApiResponse({ status: 404, description: 'Relación no encontrada' })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.genealogyService.findOne(id);
  }
}