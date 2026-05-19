import { AuditableEntity } from '../../../common/entities/auditable.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index
} from 'typeorm';

export enum EventType {
  LOT_CREATED = 'LOT_CREATED',
  LOT_UPDATED = 'LOT_UPDATED',
  LOT_STATUS_CHANGED = 'LOT_STATUS_CHANGED',
  LOT_BLOCKED = 'LOT_BLOCKED',
  LOT_QUARANTINED = 'LOT_QUARANTINED',
  MOVEMENT_CREATED = 'MOVEMENT_CREATED',
  SERIAL_CREATED = 'SERIAL_CREATED',
  SERIAL_UPDATED = 'SERIAL_UPDATED',
  LABEL_PRINTED = 'LABEL_PRINTED',
  LOCATION_CHANGED = 'LOCATION_CHANGED',
  GENEALOGY_CREATED = 'GENEALOGY_CREATED',
  QUALITY_CHECK = 'QUALITY_CHECK',
  OTHER = 'OTHER'
}

@Entity('traceability_events')
@Index(['entityType', 'entityId'])
@Index(['eventType'])
@Index(['timestamp'])
export class TraceabilityEvent extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: EventType
  })
  eventType: EventType;

  @Column({ name: 'entity_type' })
  entityType: string; // 'lot', 'serial', 'movement', etc.

  @Column({ name: 'entity_id' })
  entityId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  oldValue: any;

  @Column({ type: 'jsonb', nullable: true })
  newValue: any;

  @Column({ name: 'ip_address', nullable: true })
  ipAddress: string;

  @Column({ name: 'user_agent', nullable: true })
  userAgent: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;
}
