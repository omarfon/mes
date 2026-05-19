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
} from '@nestjs/common';
import { CreateRecipeDto, CreateRecipeParamDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto, UpdateRecipeParamDto } from './dto/update-recipe.dto';
import { FilterRecipeDto } from './dto/filter-recipe.dto';
import { RecipesService } from './recipes.service';

@Controller('master-data/process-recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  async create(@Body() dto: CreateRecipeDto) {
    return this.recipesService.create(dto);
  }

  @Get()
  async findAll(@Query() filter: FilterRecipeDto) {
    return this.recipesService.findAll(filter);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.recipesService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateRecipeDto,
  ) {
    return this.recipesService.update(id, dto);
  }

  /**
   * PATCH recipes/:id
   */
  @Patch(':id')
  async patch(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateRecipeDto,
  ) {
    return this.recipesService.update(id, dto);
  }  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.recipesService.remove(id);
  }

  @Patch(':id/active')
  async toggleActive(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('active') active: boolean,
  ) {
    return this.recipesService.toggleActive(id, active);
  }

  // Params sub-endpoints
  @Post(':recipeId/params')
  async createParam(
    @Param('recipeId', new ParseUUIDPipe()) recipeId: string,
    @Body() dto: CreateRecipeParamDto,
  ) {
    return this.recipesService.createParam(recipeId, dto);
  }

  @Get(':recipeId/params')
  async getParams(@Param('recipeId', new ParseUUIDPipe()) recipeId: string) {
    return this.recipesService.getParams(recipeId);
  }

  @Put(':recipeId/params/:paramId')
  async updateParam(
    @Param('recipeId', new ParseUUIDPipe()) recipeId: string,
    @Param('paramId', new ParseUUIDPipe()) paramId: string,
    @Body() dto: UpdateRecipeParamDto,
  ) {
    return this.recipesService.updateParam(recipeId, paramId, dto);
  }

  @Delete(':recipeId/params/:paramId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteParam(
    @Param('recipeId', new ParseUUIDPipe()) recipeId: string,
    @Param('paramId', new ParseUUIDPipe()) paramId: string,
  ) {
    await this.recipesService.deleteParam(recipeId, paramId);
  }
}
