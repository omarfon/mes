import { Controller, Get, Post, Body, Param, Patch, Delete, Query, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DefectsService } from './defects.service';
import { CreateDefectDto } from './dto/create-defect.dto';
import { UpdateDefectDto } from './dto/update-defect.dto';
import { DefectStatus } from './entities/defect.entity';

@ApiTags('Quality - Defects')
@Controller('quality/defects')
export class DefectsController {
  constructor(private readonly defectsService: DefectsService) {}

  @Post()
  create(@Body() createDto: CreateDefectDto) {
    return this.defectsService.create(createDto);
  }

  @Get()
  findAll(
    @Query('familyId') familyId?: string,
    @Query('severityId') severityId?: string,
    @Query('status') status?: DefectStatus,
    @Query('productId') productId?: string,
    @Query('productionOrderId') productionOrderId?: string,
    @Query('inspectionId') inspectionId?: string,
  ) {
    return this.defectsService.findAll({
      familyId,
      severityId,
      status,
      productId,
      productionOrderId,
      inspectionId,
    });
  }

  @Get('by-family')
  getDefectsByFamily() {
    return this.defectsService.getDefectsByFamily();
  }

  @Get('by-severity')
  getDefectsBySeverity() {
    return this.defectsService.getDefectsBySeverity();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.defectsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateDefectDto) {
    return this.defectsService.update(id, updateDto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: DefectStatus,
    @Request() req,
  ) {
    return this.defectsService.updateStatus(id, status, req.user?.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.defectsService.remove(id);
  }
}
