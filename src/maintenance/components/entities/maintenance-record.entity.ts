import { AuditableEntity } from '../../../common/entities/auditable.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { MaintenanceRecordType } from '../enums/maintenance-record-type.enum';
import { Component } from './component.entity';

@Entity('maintenance_records')
export class MaintenanceRecord extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  componentId: string;

  @ManyToOne(() => Component, (component) => component.maintenanceRecords)
  @JoinColumn({ name: 'componentId' })
  component: Component;

  @Column({
    type: 'enum',
    enum: MaintenanceRecordType
  })
  type: MaintenanceRecordType;

  @Column()
  technician: string;

  @Column({ type: 'int', nullable: true })
  hoursAtMaintenance: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'timestamp' })
  date: Date;
}
