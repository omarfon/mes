import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './entities/recipe.entity';
import { RecipeParam } from './entities/recipe-param.entity';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Recipe, RecipeParam])],
  controllers: [RecipesController],
  providers: [RecipesService],
  exports: [RecipesService, TypeOrmModule],
})
export class RecipesModule {}
