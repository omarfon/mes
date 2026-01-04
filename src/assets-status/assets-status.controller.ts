import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AssetsStatusService } from './assets-status.service';
import { CreateAssetStatusDto } from './dto/create-asset-status.dto';
import { UpdateAssetsStatusDto } from './dto/update-assets-status.dto';

@Controller('assets-status')
export class AssetsStatusController {
  constructor(private readonly assetsStatusService: AssetsStatusService) {}

  @Post()
  create(@Body() createAssetStatusDto: CreateAssetStatusDto) {
    return this.assetsStatusService.create(createAssetStatusDto);
  }

  @Get()
  findAll() {
    return this.assetsStatusService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assetsStatusService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAssetsStatusDto: UpdateAssetsStatusDto) {
    return this.assetsStatusService.update(id, updateAssetsStatusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assetsStatusService.remove(id);
  }
}
