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
} from '@nestjs/common';
import { CreateRouteDto } from './dto/create-route.dto';
import { FilterRoutesDto } from './dto/filter-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { RoutesService } from './routes.service';


@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  /**
   * Crear una ruta de proceso
   * POST /routes
   */
  @Post()
  async create(@Body() dto: CreateRouteDto) {
    return this.routesService.create(dto);
  }

  /**
   * Listar rutas con filtros/paginación
   * GET /routes?productId=&search=&isActive=&page=&limit=
   */
  @Get()
  async findAll(@Query() filter: FilterRoutesDto) {
    return this.routesService.findAll(filter);
  }

  /**
   * Obtener una ruta por ID
   * GET /routes/:id
   */
  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.routesService.findOne(id);
  }

  /**
   * Actualizar ruta (y opcionalmente sus operaciones)
   * PATCH /routes/:id
   */
  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateRouteDto,
  ) {
    return this.routesService.update(id, dto);
  }

  /**
   * Activar / desactivar ruta
   * PATCH /routes/:id/active
   */
  @Patch(':id/active')
  async toggleActive(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('isActive') isActive: boolean,
  ) {
    return this.routesService.toggleActive(id, isActive);
  }

  /**
   * Borrado lógico de ruta
   * DELETE /routes/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.routesService.softDelete(id);
  }
}
