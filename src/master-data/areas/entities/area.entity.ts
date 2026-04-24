import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Plant } from '../../plants/entities/plant.entity';

export enum AreaType {
  PREPARATION = 'PREPARATION',
  SPINNING = 'SPINNING',
  WEAVING = 'WEAVING',
  DYEING = 'DYEING',
  FINISHING = 'FINISHING',
  QUALITY = 'QUALITY',
  WAREHOUSE = 'WAREHOUSE',
  MAINTENANCE = 'MAINTENANCE',
  OTHER = 'OTHER',
}

@Entity({ name: 'areas' })
@Index(['code'], { unique: true })
export class Area {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * Código único del área
   */
  @Column({ type: 'varchar', length: 50 })
  code!: string;

  /**
   * Nombre del área
   */
  @Column({ type: 'varchar', length: 150 })
  name!: string;

  /**
   * Código de la planta (FK)
   */
  @Column({ type: 'varchar', length: 50, name: 'plant_code' })
  plantCode!: string;

  /**
   * Relación con Plant
   */
  @ManyToOne(() => Plant, { eager: false })
  @JoinColumn({ name: 'plant_code', referencedColumnName: 'code' })
  plant?: Plant;

  /**
   * Tipo de área
   */
  @Column({
    type: 'enum',
    enum: AreaType,
    default: AreaType.SPINNING,
  })
  type!: AreaType;

  /**
   * Descripción opcional
   */
  @Column({ type: 'text', nullable: true })
  description?: string;

  /**
   * Indica si el área está activa
   */
  @Column({ type: 'boolean', default: true })
  active!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
