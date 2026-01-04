import { Controller, Get, Post, Body, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationType } from './entities/location.entity';

@ApiTags('Traceability - Locations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('traceability/locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  create(@Body() createDto: CreateLocationDto) {
    return this.locationsService.create(createDto);
  }

  @Get()
  findAll(
    @Query('type') type?: LocationType,
    @Query('isActive') isActive?: boolean,
    @Query('parentLocationId') parentLocationId?: string,
  ) {
    return this.locationsService.findAll({ type, isActive, parentLocationId });
  }

  @Get('3d-map')
  get3DMap() {
    return this.locationsService.get3DMap();
  }

  @Get('code/:code')
  findByCode(@Param('code') code: string) {
    return this.locationsService.findByCode(code);
  }

  @Get(':id/hierarchy')
  getHierarchy(@Param('id') id: string) {
    return this.locationsService.getHierarchy(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.locationsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateLocationDto) {
    return this.locationsService.update(id, updateDto);
  }

  @Patch(':id/capacity')
  updateCapacity(@Param('id') id: string, @Body('capacityChange') capacityChange: number) {
    return this.locationsService.updateCapacity(id, capacityChange);
  }
}
