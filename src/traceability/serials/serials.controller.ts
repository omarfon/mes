import { Controller, Get, Post, Body, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { SerialsService } from './serials.service';
import { CreateSerialDto } from './dto/create-serial.dto';
import { UpdateSerialDto } from './dto/update-serial.dto';
import { SerialStatus } from './entities/serial.entity';

@ApiTags('Traceability - Serials')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('traceability/serials')
export class SerialsController {
  constructor(private readonly serialsService: SerialsService) {}

  @Post()
  create(@Body() createDto: CreateSerialDto) {
    return this.serialsService.create(createDto);
  }

  @Get()
  findAll(
    @Query('lotId') lotId?: string,
    @Query('productId') productId?: string,
    @Query('status') status?: SerialStatus,
    @Query('customerId') customerId?: string,
  ) {
    return this.serialsService.findAll({ lotId, productId, status, customerId });
  }

  @Get('in-warranty')
  findInWarranty() {
    return this.serialsService.findInWarranty();
  }

  @Get('serial-number/:serialNumber')
  findBySerialNumber(@Param('serialNumber') serialNumber: string) {
    return this.serialsService.findBySerialNumber(serialNumber);
  }

  @Get('lot/:lotId')
  findByLotId(@Param('lotId') lotId: string) {
    return this.serialsService.findByLotId(lotId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serialsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateSerialDto) {
    return this.serialsService.update(id, updateDto);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: SerialStatus) {
    return this.serialsService.updateStatus(id, status);
  }
}
