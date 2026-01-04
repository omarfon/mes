import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum LabelFormat {
  ZPL = 'ZPL',     // Zebra Programming Language
  EPL = 'EPL',     // Eltron Programming Language
  PDF = 'PDF',
  HTML = 'HTML',
}

@Entity('label_templates')
export class LabelTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: LabelFormat,
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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
