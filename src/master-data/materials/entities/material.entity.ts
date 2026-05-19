import { AuditableEntity } from '../../../common/entities/auditable.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index
} from 'typeorm';

export enum MaterialType {
  RAW = 'RAW',
  WIP = 'WIP',
  FINISHED = 'FINISHED'
}

@Entity({ name: 'materials' })
@Index(['code'], { unique: true })
export class Material extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50 })
  code!: string;

  @Column({ type: 'varchar', length: 200 })
  name!: string;

  @Column({
    type: 'enum',
    enum: MaterialType,
    default: MaterialType.RAW
  })
  type!: MaterialType;

  @Column({ type: 'varchar', length: 20 })
  uom!: string;

  @Column({ type: 'boolean', default: true })
  active!: boolean;
}
