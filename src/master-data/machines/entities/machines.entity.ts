import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { WorkCenter } from './work-center.entity';



// Usa el mismo enum que en los DTOs
export enum MachineStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE',
}

@Entity({ name: 'machines' })
@Index(['code'], { unique: true })
export class Machine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Código interno de la máquina (único)
   * Ej: HIL-001, CARD-02, BOB-03
   */
  @Column({ type: 'varchar', length: 50 })
  code: string;

  /**
   * Nombre descriptivo
   * Ej: “Hiladora 1”, “Carda A”
   */
  @Column({ type: 'varchar', length: 100 })
  name: string;

  /**
   * Descripción opcional
   */
  @Column({ type: 'text', nullable: true })
  description?: string | null;

  /**
   * Tipo de máquina (categoría funcional)
   * Ej: HILADORA, CARDA, TELAR, EXTRUSORA, HORNO, etc.
   */
  @Column({ type: 'varchar', length: 50, nullable: true })
  type?: string | null;

  /**
   * Modelo comercial de la máquina
   */
  @Column({ type: 'varchar', length: 100, nullable: true })
  model?: string | null;

  /**
   * Número de serie del fabricante
   */
  @Column({ type: 'varchar', length: 100, nullable: true })
  serialNumber?: string | null;

  /**
   * Área o sección de planta
   * Ej: “Preparación”, “Hilatura”, “Acabados”
   */
  @Column({ type: 'varchar', length: 100, nullable: true })
  area?: string | null;

  /**
   * Ubicación física / referencia
   * Ej: “Nave 1 - Fila B - Posición 3”
   */
  @Column({ type: 'varchar', length: 150, nullable: true })
  location?: string | null;

  /**
   * Capacidad nominal de producción
   * Ej: kg/hora, piezas/hora (lo documentas a nivel funcional)
   */
  @Column({ type: 'numeric', nullable: true })
  nominalCapacity?: number | null;

  /**
   * Estado lógico de la máquina dentro del MES
   */
  @Column({
    type: 'enum',
    enum: MachineStatus,
    default: MachineStatus.ACTIVE,
  })
  status: MachineStatus;

  /**
   * Indicador de máquina crítica para la planta
   * (para priorizar monitoreo / mantenimiento)
   */
  @Column({ type: 'boolean', default: false })
  isCritical: boolean;

  /**
   * Foreign key al centro de trabajo / línea
   */
  @Column({ name: 'work_center_id', type: 'uuid', nullable: true })
  workCenterId?: string | null;

  @ManyToOne(() => WorkCenter, (wc) => wc.machines, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'work_center_id' })
  workCenter?: WorkCenter | null;

  /**
   * Campos de auditoría
   */
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  /**
   * Soft delete (no se borra físicamente)
   */
  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date | null;
}

