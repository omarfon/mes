import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ComponentStatus } from '../enums/component-status.enum';
import { ComponentCriticality } from '../enums/component-criticality.enum';
import { MaintenanceRecord } from './maintenance-record.entity';

@Entity('maintenance_components')
export class Component {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  assetCode: string;

  @Column({ nullable: true })
  assetName: string;

  @Column({ nullable: true })
  category: string;

  @Column({
    type: 'enum',
    enum: ComponentStatus,
    default: ComponentStatus.OPERATIONAL,
  })
  status: ComponentStatus;

  @Column({ nullable: true })
  manufacturer: string;

  @Column({ nullable: true })
  model: string;

  @Column({ nullable: true })
  serialNumber: string;

  @Column({
    type: 'enum',
    enum: ComponentCriticality,
    default: ComponentCriticality.MEDIUM,
  })
  criticality: ComponentCriticality;

  @Column({ type: 'timestamp', nullable: true })
  installDate: Date;

  @Column({ type: 'int', nullable: true })
  expectedLifeHours: number;

  @Column({ type: 'int', default: 0 })
  currentHours: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'timestamp', nullable: true })
  lastInspection: Date;

  @Column({ type: 'timestamp', nullable: true })
  nextInspection: Date;

  @OneToMany(() => MaintenanceRecord, (record) => record.component)
  maintenanceRecords: MaintenanceRecord[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
