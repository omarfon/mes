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
import { RoutingStep } from './routing-step.entity';

@Entity({ name: 'routings' })
@Index(['code'], { unique: true })
export class Routing {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50 })
  code!: string;

  @Column({ type: 'varchar', length: 200 })
  name!: string;

  @Column({ type: 'varchar', length: 50, name: 'product_code' })
  productCode!: string;

  @Column({ type: 'varchar', length: 20, default: '1.0' })
  version!: string;

  @Column({ type: 'boolean', default: true })
  active!: boolean;

  @OneToMany(() => RoutingStep, (step) => step.routing, { cascade: true })
  steps!: RoutingStep[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
