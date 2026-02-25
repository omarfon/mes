import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
import { ComponentsService } from './components.service';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';
import { FilterComponentsDto } from './dto/filter-components.dto';
import { CreateMaintenanceRecordDto } from './dto/create-maintenance-record.dto';

@ApiTags('Maintenance Components')
@Controller('maintenance/components')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ComponentsController {
  constructor(private readonly componentsService: ComponentsService) {}

  @Post()
  @Roles('ADMIN', 'SUPERVISOR')
  @ApiOperation({ summary: 'Crear nuevo componente' })
  create(@Body() createComponentDto: CreateComponentDto) {
    return this.componentsService.create(createComponentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar componentes con filtros' })
  findAll(@Query() filters: FilterComponentsDto) {
    return this.componentsService.findAll(filters);
  }

  @Get('unique-assets')
  @ApiOperation({ summary: 'Obtener lista de activos únicos' })
  getUniqueAssets() {
    return this.componentsService.getUniqueAssets();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener componente por ID' })
  findOne(@Param('id') id: string) {
    return this.componentsService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'SUPERVISOR')
  @ApiOperation({ summary: 'Actualizar componente' })
  update(@Param('id') id: string, @Body() updateComponentDto: UpdateComponentDto) {
    return this.componentsService.update(id, updateComponentDto);
  }

  @Patch(':id/hours')
  @Roles('ADMIN', 'SUPERVISOR', 'OPERATOR')
  @ApiOperation({ summary: 'Actualizar horas de operación del componente' })
  updateHours(@Param('id') id: string, @Body('hours') hours: number) {
    return this.componentsService.updateHours(id, hours);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Eliminar componente' })
  remove(@Param('id') id: string) {
    return this.componentsService.remove(id);
  }

  @Post(':id/maintenance-records')
  @Roles('ADMIN', 'SUPERVISOR', 'OPERATOR')
  @ApiOperation({ summary: 'Agregar registro de mantenimiento' })
  addMaintenanceRecord(
    @Param('id') id: string,
    @Body() createRecordDto: CreateMaintenanceRecordDto,
  ) {
    return this.componentsService.addMaintenanceRecord(id, createRecordDto);
  }

  @Get(':id/maintenance-records')
  @ApiOperation({ summary: 'Obtener registros de mantenimiento del componente' })
  getMaintenanceRecords(@Param('id') id: string) {
    return this.componentsService.getMaintenanceRecords(id);
  }
}
