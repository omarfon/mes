// src/traceability/movements/movements.controller.ts
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
import { MovementsService } from './movements.service';
import { CreateLotMovementDto } from './dto/create-lot-movements.dto';
import { FilterMovementDto } from './dto/filter-lot-movements.dto';


@ApiTags('Traceability - Movements')
@Controller('traceability/movements')
export class MovementsController {
  constructor(private readonly movementsService: MovementsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nuevo movimiento de lote' })
  @ApiResponse({ status: 201, description: 'Movimiento creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(@Body() createDto: CreateLotMovementDto) {
    return this.movementsService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar movimientos con filtros' })
  @ApiResponse({ status: 200, description: 'Lista obtenida exitosamente' })
  async findAll(@Query() filter: FilterMovementDto) {
    return this.movementsService.findAll(filter);
  }

  @Get('lot/:lotId')
  @ApiOperation({ summary: 'Obtener movimientos por ID de lote' })
  @ApiParam({ name: 'lotId', description: 'ID del lote' })
  @ApiResponse({ status: 200, description: 'Movimientos encontrados' })
  async findByLotId(@Param('lotId', new ParseUUIDPipe()) lotId: string) {
    return this.movementsService.findByLotId(lotId);
  }

  @Get('lot-code/:lotCode')
  @ApiOperation({ summary: 'Obtener movimientos por código de lote' })
  @ApiParam({ name: 'lotCode', description: 'Código del lote' })
  @ApiResponse({ status: 200, description: 'Movimientos encontrados' })
  async findByLotCode(@Param('lotCode') lotCode: string) {
    return this.movementsService.findByLotCode(lotCode);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener movimiento por ID' })
  @ApiParam({ name: 'id', description: 'ID del movimiento' })
  @ApiResponse({ status: 200, description: 'Movimiento encontrado' })
  @ApiResponse({ status: 404, description: 'Movimiento no encontrado' })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.movementsService.findOne(id);
  }
}