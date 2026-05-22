import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { CreateShiftDto } from './dto/create-schift.dto';
import { FilterShiftsDto } from './dto/filter-schift.dto';
import { UpdateShiftDto } from './dto/update-schift.dto';
import { ShiftsService } from './schift.service';


@Controller('master-data/shifts')
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  /**
   * Crear turno
   * POST /shifts
   */
  @Post()
  async create(@Body() dto: CreateShiftDto, @Request() req) {
    return this.shiftsService.create(dto, req.user?.userId, req.ip);
  }

  /**
   * Listar turnos con filtros/paginación
   * GET /shifts?search=&isActive=&page=&limit=
   */
  @Get()
  async findAll(@Query() filter: FilterShiftsDto) {
    return this.shiftsService.findAll(filter);
  }

  /**
   * Obtener turno por ID
   * GET /shifts/:id
   */
  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.shiftsService.findOne(id);
  }

  /**
   * Actualizar turno
   * PATCH /shifts/:id
   */
  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateShiftDto,
    @Request() req,
  ) {
    return this.shiftsService.update(id, dto, req.user?.userId, req.ip);
  }

  /**
   * Activar / desactivar turno
   * PATCH /shifts/:id/active
   */
  @Patch(':id/active')
  async toggleActive(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('isActive') isActive: boolean,
  ) {
    return this.shiftsService.toggleActive(id, isActive);
  }

  /**
   * Borrado lógico
   * DELETE /shifts/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string, @Request() req): Promise<void> {
    await this.shiftsService.softDelete(id, req.user?.userId, req.ip);
  }
}
