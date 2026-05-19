import { AuditableEntity } from '../../../common/entities/auditable.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column
} from 'typeorm';

export enum LabelFormat {
  ZPL = 'ZPL',     // Zebra Programming Language
  EPL = 'EPL',     // Eltron Programming Language
  PDF = 'PDF',
  HTML = 'HTML'
}

@Entity('label_templates')
export class LabelTemplate extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: LabelFormat
  })
  format: LabelFormat;

  @Column({ type: 'text' })
  template: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  // Dimensiones en milímetros
  @Column({ type: 'int', nullable: true })
  widthMm: number;

  @Column({ type: 'int', nullable: true })
  heightMm: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
