import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/master-data/users/entities/user.entity';
import { AddDefectDto } from '../dto/add-deffect.dto';
import { CreateInspectionDto } from '../dto/create-inspection.dto';
import { FilterInspectionsDto } from '../dto/filter-inspection.dto';
import { InspectionStatus } from '../entities/inspection.entity';
import { InspectionsService } from './inspection.service';


@ApiTags('Quality')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('quality')
export class InspectionsController {
  constructor(private readonly service: InspectionsService) {}

  @Post('inspections')
  @Roles(UserRole.SUPERVISOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Crear inspección de calidad' })
  create(@Body() dto: CreateInspectionDto) {
    return this.service.createInspection(dto);
  }

  @Post('inspections/:id/defects')
  @Roles(UserRole.SUPERVISOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Agregar defecto a una inspección' })
  addDefect(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: AddDefectDto,
  ) {
    return this.service.addDefect(id, dto);
  }

  @Patch('inspections/:id/status/:status')
  @Roles(UserRole.SUPERVISOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Cambiar estado de una inspección' })
  updateStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('status') status: InspectionStatus,
  ) {
    return this.service.updateStatus(id, status);
  }

  @Get('inspections')
  @ApiOperation({ summary: 'Listar inspecciones con filtros' })
  findAll(@Query() filter: FilterInspectionsDto) {
    return this.service.findAll(filter);
  }

  @Get('inspections/:id')
  @ApiOperation({ summary: 'Obtener detalle de inspección' })
  getOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.getOne(id);
  }
}
