import { AuditableEntity } from '../../../common/entities/auditable.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { User } from '../../../master-data/users/entities/user.entity';

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  VIEW = 'VIEW',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  BLOCK = 'BLOCK',
  UNBLOCK = 'UNBLOCK'
}

@Entity('audits')
@Index(['entityType', 'entityId'])
@Index(['userId', 'fechaCreacion'])
@Index(['action', 'fechaCreacion'])
export class Audit extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: AuditAction
  })
  action: AuditAction;

  @Column({ length: 100 })
  entityType: string;

  @Column({ length: 100 })
  entityId: string;

  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'jsonb', nullable: true })
  oldValues: any;

  @Column({ type: 'jsonb', nullable: true })
  newValues: any;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 45, nullable: true })
  ipAddress: string;

  @Column({ type: 'text', nullable: true })
  userAgent: string;

  @Column({ length: 100, nullable: true })
  module: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;
}
