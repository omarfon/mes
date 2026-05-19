import { AuditableEntity } from '../../common/entities/auditable.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index
} from 'typeorm';

export enum NotificationType {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS'
}

export enum NotificationCategory {
  PRODUCTION = 'PRODUCTION',
  MACHINE = 'MACHINE',
  QUALITY = 'QUALITY',
  MAINTENANCE = 'MAINTENANCE',
  SYSTEM = 'SYSTEM'
}

@Entity({ name: 'notifications' })
@Index(['userId', 'isRead'])
@Index(['fechaCreacion'])
export class Notification extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId: string | null;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.INFO
  })
  type: NotificationType;

  @Column({
    type: 'enum',
    enum: NotificationCategory,
    default: NotificationCategory.SYSTEM
  })
  category: NotificationCategory;

  @Column({ name: 'is_read', type: 'boolean', default: false })
  isRead: boolean;

  @Column({ name: 'related_entity_type', type: 'varchar', length: 50, nullable: true })
  relatedEntityType: string | null;

  @Column({ name: 'related_entity_id', type: 'uuid', nullable: true })
  relatedEntityId: string | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any> | null;
}
