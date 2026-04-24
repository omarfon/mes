import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export enum CalendarEventType {
  HOLIDAY = 'HOLIDAY',
  PLANNED_STOP = 'PLANNED_STOP',
  EXTRA_SHIFT = 'EXTRA_SHIFT',
  MAINTENANCE_WINDOW = 'MAINTENANCE_WINDOW',
}

@Entity({ name: 'plant_calendar' })
export class PlantCalendar {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * Fecha del evento
   */
  @Column({ type: 'date' })
  date!: Date;

  /**
   * Tipo de evento
   */
  @Column({
    type: 'enum',
    enum: CalendarEventType,
  })
  type!: CalendarEventType;

  /**
   * Nombre/descripción del evento
   */
  @Column({ type: 'varchar', length: 200 })
  name!: string;

  /**
   * Código de la planta (FK)
   */
  @Column({ type: 'varchar', length: 50, name: 'plant_code' })
  plantCode!: string;

  /**
   * Afecta a todas las áreas/centros
   */
  @Column({ type: 'boolean', default: true, name: 'affects_all' })
  affectsAll!: boolean;

  /**
   * Notas adicionales
   */
  @Column({ type: 'text', default: '' })
  notes!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
