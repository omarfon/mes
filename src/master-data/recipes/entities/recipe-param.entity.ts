import { AuditableEntity } from '../../../common/entities/auditable.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Recipe } from './recipe.entity';

@Entity({ name: 'recipe_params' })
export class RecipeParam extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'recipe_id' })
  recipeId!: string;

  @ManyToOne(() => Recipe, (recipe) => recipe.params, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipe_id' })
  recipe!: Recipe;

  @Column({ type: 'varchar', length: 100, name: 'param_name' })
  paramName!: string;

  @Column({ type: 'varchar', length: 50 })
  setpoint!: string;

  @Column({ type: 'varchar', length: 50, name: 'min_value', default: '' })
  minValue!: string;

  @Column({ type: 'varchar', length: 50, name: 'max_value', default: '' })
  maxValue!: string;

  @Column({ type: 'varchar', length: 20, default: '' })
  unit!: string;

  @Column({ type: 'boolean', default: false })
  critical!: boolean;

  @Column({ type: 'text', default: '' })
  notes!: string;
}
