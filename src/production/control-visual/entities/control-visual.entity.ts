import { AuditableEntity } from '../../../common/entities/auditable.entity';
// src/production/control-visual/entities/control-visual.entity.ts
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  Index,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Machine } from '../../../master-data/machines/entities/machines.entity';
import { WorkCenter } from '../../../master-data/work-centers/entities/work-center.entity';

export enum EstadoVisual {
  NORMAL = 'NORMAL',
  ADVERTENCIA = 'ADVERTENCIA',
  CRITICO = 'CRITICO',
  DETENIDO = 'DETENIDO'
}

export enum TipoAlerta {
  PRODUCCION_BAJA = 'PRODUCCION_BAJA',
  CALIDAD = 'CALIDAD',
  MANTENIMIENTO = 'MANTENIMIENTO',
  MATERIAL = 'MATERIAL',
  SEGURIDAD = 'SEGURIDAD',
  OTRO = 'OTRO'
}

@Entity({ name: 'control_visual' })
export class ControlVisual extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Relación con Máquina
  @Column({ type: 'uuid', name: 'maquina_id', nullable: true })
  @Index()
  maquinaId: string;

  @ManyToOne(() => Machine, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'maquina_id' })
  maquina?: Machine;

  // Relación con Centro de Trabajo
  @Column({ type: 'uuid', name: 'work_center_id', nullable: true })
  @Index()
  workCenterId: string;

  @ManyToOne(() => WorkCenter, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'work_center_id' })
  workCenter?: WorkCenter;

  @Column({ type: 'uuid', name: 'orden_id', nullable: true })
  @Index()
  ordenId: string;

  @Column({ 
    type: 'enum', 
    enum: EstadoVisual, 
    default: EstadoVisual.NORMAL 
  })
  estado: EstadoVisual;

  @Column({ type: 'enum', enum: TipoAlerta, nullable: true })
  tipoAlerta: TipoAlerta;

  @Column({ type: 'varchar', length: 255, nullable: true })
  mensaje: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'eficiencia_actual', nullable: true })
  eficienciaActual: number;

  @Column({ type: 'decimal', precision: 12, scale: 3, name: 'produccion_actual', nullable: true })
  produccionActual: number;

  @Column({ type: 'decimal', precision: 12, scale: 3, name: 'produccion_objetivo', nullable: true })
  produccionObjetivo: number;

  @Column({ type: 'int', name: 'piezas_rechazadas', default: 0 })
  piezasRechazadas: number;

  @Column({ type: 'int', name: 'tiempo_parada_minutos', default: 0 })
  tiempoParadaMinutos: number;

  @Column({ type: 'boolean', name: 'requiere_atencion', default: false })
  requiereAtencion: boolean;

  @Column({ type: 'boolean', name: 'alerta_activa', default: false })
  alertaActiva: boolean;

  @Column({ type: 'timestamp', name: 'ultima_actualizacion', nullable: true })
  ultimaActualizacion: Date;

  @Column({ type: 'jsonb', nullable: true })
  metricas: any;

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive: boolean;
}