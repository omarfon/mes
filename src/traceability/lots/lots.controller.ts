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
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { LotsService } from './lots.service';
import { CreateLotDto } from './dto/create-lot.dto';
import { UpdateLotDto } from './dto/update-lot.dto';
import { UpdateLotStatusDto } from './dto/update-lot-status.dto';
import { BlockLotDto } from './dto/block-lot.dto';
import { QuarantineLotDto } from './dto/quarantine-lot.dto';

@ApiTags('Traceability - Lots')
@ApiBearerAuth()
/* @UseGuards(JwtAuthGuard) */
@Controller('traceability/lots')
export class LotsController {
  constructor(private readonly lotsService: LotsService) {}

  @Post()
  create(@Body() createLotDto: CreateLotDto) {
    return this.lotsService.create(createLotDto);
  }

  @Get()
  @ApiQuery({ name: 'productId', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'locationId', required: false })
  @ApiQuery({ name: 'search', required: false })
  findAll(@Query() filters: any) {
    return this.lotsService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lotsService.findOne(id);
  }

  @Get('number/:lotNumber')
  findByLotNumber(@Param('lotNumber') lotNumber: string) {
    return this.lotsService.findByLotNumber(lotNumber);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLotDto: UpdateLotDto) {
    return this.lotsService.update(id, updateLotDto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateLotStatusDto,
  ) {
    return this.lotsService.updateStatus(id, updateStatusDto);
  }

  @Patch(':id/block')
  block(@Param('id') id: string, @Body() blockDto: BlockLotDto) {
    return this.lotsService.block(id, blockDto);
  }

  @Patch(':id/quarantine')
  quarantine(@Param('id') id: string, @Body() quarantineDto: QuarantineLotDto) {
    return this.lotsService.quarantine(id, quarantineDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lotsService.remove(id);
  }
}
