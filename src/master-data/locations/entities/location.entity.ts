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

export enum LocationType {
  WAREHOUSE = 'WAREHOUSE',
  LINE = 'LINE',
  STATION = 'STATION',
}

@Entity({ name: 'locations' })
@Index(['code'], { unique: true })
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * Código único de la ubicación
   */
  @Column({ type: 'varchar', length: 50 })
  code!: string;

  /**
   * Nombre de la ubicación
   */
  @Column({ type: 'varchar', length: 150 })
  name!: string;

  /**
   * Tipo de ubicación
   */
  @Column({
    type: 'enum',
    enum: LocationType,
    default: LocationType.WAREHOUSE,
  })
  type!: LocationType;

  /**
   * Código de ubicación padre (árbol jerárquico)
   */
  @Column({ type: 'varchar', length: 50, nullable: true, name: 'parent_code' })
  parentCode?: string;

  /**
   * Relación con ubicación padre
   */
  @ManyToOne(() => Location, { nullable: true })
  @JoinColumn({ name: 'parent_code', referencedColumnName: 'code' })
  parent?: Location;

  /**
   * Indica si la ubicación está activa
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
