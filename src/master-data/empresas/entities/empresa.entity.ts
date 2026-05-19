import { AuditableEntity } from '../../../common/entities/auditable.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index
} from 'typeorm';

@Entity({ name: 'empresas' })
@Index(['ruc'], { unique: true })
export class Empresa extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  ruc!: string;

  @Column({ type: 'varchar', length: 200 })
  name!: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  address!: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  phone!: string;

  @Column({ type: 'varchar', length: 100, default: '' })
  email!: string;

  @Column({ type: 'boolean', default: true })
  active!: boolean;
}
