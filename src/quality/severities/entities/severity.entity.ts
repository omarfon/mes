import { AuditableEntity } from '../../../common/entities/auditable.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column
} from 'typeorm';

@Entity('quality_severities')
export class Severity extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', default: 1 })
  level: number; // 1=Minor, 2=Moderate, 3=Major, 4=Critical, 5=Catastrophic

  @Column({ default: '#FFA500' })
  color: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
