import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/master-data/users/entities/user.entity';
import { CreateTraceNodeDto } from './dto/create-trace-node.dto';
import { FilterTraceNodesDto } from './dto/filter-trace-node.dto';
import { LinkTraceNodesDto } from './dto/link-trace-node.dto';
import { TraceabilityService } from './traceability.service';



@ApiTags('Traceability')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('traceability')
export class TraceabilityController {
  constructor(private readonly traceService: TraceabilityService) {}

  @Post('nodes')
  @ApiOperation({ summary: 'Crear nodo trazable (lote, prenda, contenedor, proceso, etc.)' })
  @Roles(UserRole.ADMIN, UserRole.SUPERVISOR)
  createNode(@Body() dto: CreateTraceNodeDto) {
    return this.traceService.createNode(dto);
  }

  @Get('nodes')
  @ApiOperation({ summary: 'Listar nodos trazables' })
  findNodes(@Query() filter: FilterTraceNodesDto) {
    return this.traceService.findNodes(filter);
  }

  @Get('nodes/code/:code')
  @ApiOperation({ summary: 'Buscar nodo por código' })
  findNodeByCode(@Param('code') code: string) {
    return this.traceService.findNodeByCode(code);
  }

  @Post('links')
  @ApiOperation({ summary: 'Crear relación de trazabilidad entre nodos' })
  @Roles(UserRole.ADMIN, UserRole.SUPERVISOR)
  linkNodes(@Body() dto: LinkTraceNodesDto) {
    return this.traceService.linkNodes(dto);
  }

  @Get('nodes/:id/upstream')
  @ApiOperation({
    summary: 'Genealogía hacia atrás (origen de este nodo)',
  })
  getUpstream(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query('depth') depth?: number,
  ) {
    return this.traceService.getUpstream(id, depth ? Number(depth) : 3);
  }

  @Get('nodes/:id/downstream')
  @ApiOperation({
    summary: 'Genealogía hacia adelante (impacto de este nodo)',
  })
  getDownstream(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query('depth') depth?: number,
  ) {
    return this.traceService.getDownstream(id, depth ? Number(depth) : 3);
  }
}
