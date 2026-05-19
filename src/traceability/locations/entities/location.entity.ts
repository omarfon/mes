import { AuditableEntity } from '../../../common/entities/auditable.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index
} from 'typeorm';

export enum LocationType {
  WAREHOUSE = 'WAREHOUSE',
  AISLE = 'AISLE',
  RACK = 'RACK',
  SHELF = 'SHELF',
  BIN = 'BIN',
  PRODUCTION_LINE = 'PRODUCTION_LINE',
  QUARANTINE = 'QUARANTINE',
  INSPECTION = 'INSPECTION',
  SHIPPING = 'SHIPPING'
}

@Entity('locations')
@Index(['code'], { unique: true })
export class Location extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: LocationType
  })
  type: LocationType;

  @Column({ name: 'parent_location_id', nullable: true })
  parentLocationId: string;

  // Coordenadas para mapa 3D
  @Column({ name: 'x_coordinate', type: 'decimal', precision: 10, scale: 2, nullable: true })
  xCoordinate: number;

  @Column({ name: 'y_coordinate', type: 'decimal', precision: 10, scale: 2, nullable: true })
  yCoordinate: number;

  @Column({ name: 'z_coordinate', type: 'decimal', precision: 10, scale: 2, nullable: true })
  zCoordinate: number;

  // Capacidad
  @Column({ name: 'max_capacity', type: 'decimal', precision: 10, scale: 2, nullable: true })
  maxCapacity: number;

  @Column({ name: 'current_capacity', type: 'decimal', precision: 10, scale: 2, default: 0 })
  currentCapacity: number;

  @Column({ name: 'unit_of_measure', nullable: true })
  unitOfMeasure: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ type: 'text', nullable: true })
  description: string;

  // Relación auto-referencial para jerarquía
  @ManyToOne(() => Location, { nullable: true })
  @JoinColumn({ name: 'parent_location_id' })
  parentLocation: Location;
}
