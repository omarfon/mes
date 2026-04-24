import { PartialType } from '@nestjs/mapped-types';
import { CreateRecipeDto, CreateRecipeParamDto } from './create-recipe.dto';

export class UpdateRecipeDto extends PartialType(CreateRecipeDto) {}
export class UpdateRecipeParamDto extends PartialType(CreateRecipeParamDto) {}
