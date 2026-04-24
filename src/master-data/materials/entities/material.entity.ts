import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export enum MaterialType {
  RAW = 'RAW',
  WIP = 'WIP',
  FINISHED = 'FINISHED',
}

@Entity({ name: 'materials' })
@Index(['code'], { unique: true })
export class Material {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50 })
  code!: string;

  @Column({ type: 'varchar', length: 200 })
  name!: string;

  @Column({
    type: 'enum',
    enum: MaterialType,
    default: MaterialType.RAW,
  })
  type!: MaterialType;

  @Column({ type: 'varchar', length: 20 })
  uom!: string;

  @Column({ type: 'boolean', default: true })
  active!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
