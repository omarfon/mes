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
import { CreateScrapReasonDto } from './dto/create-scrap-reason.dto';
import { UpdateScrapReasonDto } from './dto/update-scrap-reason.dto';
import { FilterScrapReasonDto } from './dto/filter-scrap-reason.dto';
import { ScrapReasonsService } from './scrap-reasons.service';

@Controller('master-data/scrap-reasons')
export class ScrapReasonsController {
  constructor(private readonly scrapReasonsService: ScrapReasonsService) {}

  @Post()
  async create(@Body() dto: CreateScrapReasonDto, @Request() req) {
    return this.scrapReasonsService.create(dto, req.user?.userId, req.ip);
  }

  @Get()
  async findAll(@Query() filter: FilterScrapReasonDto) {
    return this.scrapReasonsService.findAll(filter);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.scrapReasonsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateScrapReasonDto,
    @Request() req,
  ) {
    return this.scrapReasonsService.update(id, dto, req.user?.userId, req.ip);
  }

  /**
   * PATCH scrap-reasons/:id
   */
  @Patch(':id')
  async patch(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateScrapReasonDto,
    @Request() req,
  ) {
    return this.scrapReasonsService.update(id, dto, req.user?.userId, req.ip);
  }  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string, @Request() req) {
    await this.scrapReasonsService.remove(id, req.user?.userId, req.ip);
  }

  @Patch(':id/active')
  async toggleActive(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('active') active: boolean,
  ) {
    return this.scrapReasonsService.toggleActive(id, active);
  }
}
