import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { RecipeParam } from './recipe-param.entity';

@Entity({ name: 'recipes' })
@Index(['code'], { unique: true })
export class Recipe {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50 })
  code!: string;

  @Column({ type: 'varchar', length: 200 })
  name!: string;

  @Column({ type: 'varchar', length: 50, name: 'product_code' })
  productCode!: string;

  @Column({ type: 'varchar', length: 50, name: 'operation_code', default: '' })
  operationCode!: string;

  @Column({ type: 'varchar', length: 20, default: '1.0' })
  version!: string;

  @Column({ type: 'varchar', length: 150, name: 'approved_by', default: '' })
  approvedBy!: string;

  @Column({ type: 'varchar', length: 50, name: 'approved_at', default: '' })
  approvedAt!: string;

  @Column({ type: 'boolean', default: true })
  active!: boolean;

  @OneToMany(() => RecipeParam, (param) => param.recipe, { cascade: true })
  params!: RecipeParam[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
