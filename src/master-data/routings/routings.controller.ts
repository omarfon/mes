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
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { CreateRoutingDto, CreateRoutingStepDto } from './dto/create-routing.dto';
import { UpdateRoutingDto, UpdateRoutingStepDto } from './dto/update-routing.dto';
import { FilterRoutingDto } from './dto/filter-routing.dto';
import { RoutingsService } from './routings.service';

@Controller('master-data/routings')
export class RoutingsController {
  constructor(private readonly routingsService: RoutingsService) {}

  @Post()
  async create(@Body() dto: CreateRoutingDto, @Request() req) {
    return this.routingsService.create(dto, req.user?.userId, req.ip);
  }

  @Get()
  async findAll(@Query() filter: FilterRoutingDto) {
    return this.routingsService.findAll(filter);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.routingsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateRoutingDto,
    @Request() req,
  ) {
    return this.routingsService.update(id, dto, req.user?.userId, req.ip);
  }

  /**
   * PATCH routings/:id
   */
  @Patch(':id')
  async patch(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateRoutingDto,
    @Request() req,
  ) {
    return this.routingsService.update(id, dto, req.user?.userId, req.ip);
  }  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string, @Request() req) {
    await this.routingsService.remove(id, req.user?.userId, req.ip);
  }

  @Patch(':id/active')
  async toggleActive(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('active') active: boolean,
  ) {
    return this.routingsService.toggleActive(id, active);
  }

  // Steps sub-endpoints
  @Post(':routingId/steps')
  async createStep(
    @Param('routingId', new ParseUUIDPipe()) routingId: string,
    @Body() dto: CreateRoutingStepDto,
  ) {
    return this.routingsService.createStep(routingId, dto);
  }

  @Get(':routingId/steps')
  async getSteps(@Param('routingId', new ParseUUIDPipe()) routingId: string) {
    return this.routingsService.getSteps(routingId);
  }

  @Put(':routingId/steps/:stepId')
  async updateStep(
    @Param('routingId', new ParseUUIDPipe()) routingId: string,
    @Param('stepId', new ParseUUIDPipe()) stepId: string,
    @Body() dto: UpdateRoutingStepDto,
    @Request() req,
  ) {
    return this.routingsService.updateStep(routingId, stepId, dto);
  }

  @Delete(':routingId/steps/:stepId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteStep(
    @Param('routingId', new ParseUUIDPipe()) routingId: string,
    @Param('stepId', new ParseUUIDPipe()) stepId: string,
  ) {
    await this.routingsService.deleteStep(routingId, stepId);
  }
}
