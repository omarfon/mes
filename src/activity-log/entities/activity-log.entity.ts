import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export enum ActivityAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  STATUS_CHANGE = 'STATUS_CHANGE',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
}

export enum ActivityModule {
  AUTH = 'AUTH',
  PRODUCTION_ORDER = 'PRODUCTION_ORDER',
  MACHINE = 'MACHINE',
  PRODUCT = 'PRODUCT',
  USER = 'USER',
  WORK_CENTER = 'WORK_CENTER',
  QUALITY = 'QUALITY',
  TRACEABILITY = 'TRACEABILITY',
  NOTIFICATION = 'NOTIFICATION',
  REPORT = 'REPORT',
  SYSTEM = 'SYSTEM',
}

@Entity({ name: 'activity_logs' })
@Index(['userId', 'createdAt'])
@Index(['entityType', 'entityId'])
@Index(['module', 'action'])
export class ActivityLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId: string | null;

  @Column({ name: 'user_email', type: 'varchar', length: 255, nullable: true })
  userEmail: string | null;

  @Column({ name: 'user_name', type: 'varchar', length: 255, nullable: true })
  userName: string | null;

  @Column({
    type: 'enum',
    enum: ActivityModule,
  })
  module: ActivityModule;

  @Column({
    type: 'enum',
    enum: ActivityAction,
  })
  action: ActivityAction;

  @Column({ name: 'entity_type', type: 'varchar', length: 100 })
  entityType: string;

  @Column({ name: 'entity_id', type: 'varchar', length: 255, nullable: true })
  entityId: string | null;

  @Column({ name: 'entity_name', type: 'varchar', length: 255, nullable: true })
  entityName: string | null;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'ip_address', type: 'varchar', length: 45, nullable: true })
  ipAddress: string | null;

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent: string | null;

  @Column({ name: 'old_values', type: 'jsonb', nullable: true })
  oldValues: Record<string, any> | null;

  @Column({ name: 'new_values', type: 'jsonb', nullable: true })
  newValues: Record<string, any> | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any> | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
