import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Recipe } from './entities/recipe.entity';
import { RecipeParam } from './entities/recipe-param.entity';
import { CreateRecipeDto, CreateRecipeParamDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto, UpdateRecipeParamDto } from './dto/update-recipe.dto';
import { FilterRecipeDto } from './dto/filter-recipe.dto';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipesRepo: Repository<Recipe>,
    @InjectRepository(RecipeParam)
    private readonly paramsRepo: Repository<RecipeParam>,
  ) {}

  async create(dto: CreateRecipeDto): Promise<Recipe> {
    const existing = await this.recipesRepo.findOne({
      where: { code: dto.code.toUpperCase() },
      withDeleted: true,
    });

    if (existing) {
      throw new ConflictException('Recipe code already in use');
    }

    const recipe = this.recipesRepo.create({
      code: dto.code.toUpperCase(),
      name: dto.name,
      productCode: dto.productCode.toUpperCase(),
      operationCode: dto.operationCode?.toUpperCase() || '',
      version: dto.version || '1.0',
      approvedBy: dto.approvedBy || '',
      approvedAt: dto.approvedAt || '',
      active: dto.active ?? true,
    });

    const saved = await this.recipesRepo.save(recipe);

    if (dto.params && dto.params.length > 0) {
      const params = dto.params.map((param) =>
        this.paramsRepo.create({
          recipeId: saved.id,
          paramName: param.paramName,
          setpoint: param.setpoint,
          minValue: param.minValue || '',
          maxValue: param.maxValue || '',
          unit: param.unit || '',
          critical: param.critical ?? false,
          notes: param.notes || '',
        }),
      );
      await this.paramsRepo.save(params);
    }

    return this.findOne(saved.id);
  }

  async findAll(filter: FilterRecipeDto) {
    const { page = 1, limit = 20, search, productCode, active } = filter;

    const where: any = {};

    if (typeof active === 'boolean') {
      where.active = active;
    }

    if (productCode) {
      where.productCode = productCode.toUpperCase();
    }

    if (search) {
      where.code = ILike(`%${search}%`);
    }

    const [data, total] = await this.recipesRepo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['params'],
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Recipe> {
    const recipe = await this.recipesRepo.findOne({
      where: { id },
      relations: ['params'],
    });

    if (!recipe) {
      throw new NotFoundException(`Recipe ${id} not found`);
    }

    return recipe;
  }

  async update(id: string, dto: UpdateRecipeDto): Promise<Recipe> {
    const recipe = await this.findOne(id);

    if (dto.code && dto.code.toUpperCase() !== recipe.code) {
      const exists = await this.recipesRepo.findOne({
        where: { code: dto.code.toUpperCase() },
      });

      if (exists) {
        throw new ConflictException('Recipe code already in use');
      }
    }

    Object.assign(recipe, {
      ...dto,
      code: dto.code ? dto.code.toUpperCase() : recipe.code,
      productCode: dto.productCode ? dto.productCode.toUpperCase() : recipe.productCode,
    });

    return this.recipesRepo.save(recipe);
  }

  async remove(id: string): Promise<void> {
    const recipe = await this.findOne(id);
    await this.recipesRepo.softDelete(recipe.id);
  }

  async toggleActive(id: string, active: boolean): Promise<Recipe> {
    const recipe = await this.findOne(id);
    recipe.active = active;
    return this.recipesRepo.save(recipe);
  }

  // Params CRUD
  async createParam(recipeId: string, dto: CreateRecipeParamDto): Promise<RecipeParam> {
    const recipe = await this.findOne(recipeId);

    const param = this.paramsRepo.create({
      recipeId: recipe.id,
      paramName: dto.paramName,
      setpoint: dto.setpoint,
      minValue: dto.minValue || '',
      maxValue: dto.maxValue || '',
      unit: dto.unit || '',
      critical: dto.critical ?? false,
      notes: dto.notes || '',
    });

    return this.paramsRepo.save(param);
  }

  async getParams(recipeId: string): Promise<RecipeParam[]> {
    await this.findOne(recipeId);

    return this.paramsRepo.find({
      where: { recipeId },
      order: { paramName: 'ASC' },
    });
  }

  async updateParam(recipeId: string, paramId: string, dto: UpdateRecipeParamDto): Promise<RecipeParam> {
    const param = await this.paramsRepo.findOne({ where: { id: paramId, recipeId } });

    if (!param) {
      throw new NotFoundException(`Recipe param ${paramId} not found`);
    }

    Object.assign(param, dto);

    return this.paramsRepo.save(param);
  }

  async deleteParam(recipeId: string, paramId: string): Promise<void> {
    const param = await this.paramsRepo.findOne({ where: { id: paramId, recipeId } });

    if (!param) {
      throw new NotFoundException(`Recipe param ${paramId} not found`);
    }

    await this.paramsRepo.remove(param);
  }
}
