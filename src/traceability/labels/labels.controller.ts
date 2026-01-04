import { Controller, Get, Post, Body, Param, Patch, Query, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { LabelsService } from './labels.service';
import { CreateLabelTemplateDto } from './dto/create-label-template.dto';
import { UpdateLabelTemplateDto } from './dto/update-label-template.dto';
import { PrintLabelDto } from './dto/print-label.dto';
import { PrintStatus } from './entities/label-print-history.entity';

@ApiTags('Traceability - Labels')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('traceability/labels')
export class LabelsController {
  constructor(private readonly labelsService: LabelsService) {}

  // Template endpoints
  @Post('templates')
  createTemplate(@Body() createDto: CreateLabelTemplateDto) {
    return this.labelsService.createTemplate(createDto);
  }

  @Get('templates')
  findAllTemplates(@Query('isActive') isActive?: boolean) {
    return this.labelsService.findAllTemplates(isActive);
  }

  @Get('templates/:id')
  findTemplateById(@Param('id') id: string) {
    return this.labelsService.findTemplateById(id);
  }

  @Patch('templates/:id')
  updateTemplate(@Param('id') id: string, @Body() updateDto: UpdateLabelTemplateDto) {
    return this.labelsService.updateTemplate(id, updateDto);
  }

  // Print endpoints
  @Post('print')
  printLabel(@Request() req, @Body() printDto: PrintLabelDto) {
    return this.labelsService.printLabel(req.user.userId, printDto);
  }

  @Get('print-history')
  getPrintHistory(
    @Query('lotId') lotId?: string,
    @Query('serialId') serialId?: string,
    @Query('templateId') templateId?: string,
    @Query('status') status?: PrintStatus,
  ) {
    return this.labelsService.getPrintHistory({ lotId, serialId, templateId, status });
  }
}
