import { AuditableEntity } from '../../../common/entities/auditable.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column
} from 'typeorm';

@Entity('quality_defect_families')
export class DefectFamily extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: '#2196F3' })
  color: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
