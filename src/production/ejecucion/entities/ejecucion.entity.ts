import { AuditableEntity } from '../../../common/entities/auditable.entity';
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  Index,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Machine } from '../../../master-data/machines/entities/machines.entity';
import { Operador } from '../../../master-data/operadores/entities/operador.entity';

export enum EstadoEjecucion {
  INICIADA = 'INICIADA',
  EN_PROCESO = 'EN_PROCESO',
  PAUSADA = 'PAUSADA',
  COMPLETADA = 'COMPLETADA',
  DETENIDA = 'DETENIDA'
}

@Entity({ name: 'ejecuciones' })
export class Ejecucion extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'orden_id' })
  @Index()
  ordenId: string;

  // Relación con Máquina
  @Column({ type: 'uuid', name: 'maquina_id', nullable: true })
  maquinaId: string;

  @ManyToOne(() => Machine, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'maquina_id' })
  maquina?: Machine;

  // Relación con Operador
  @Column({ type: 'uuid', name: 'operador_id', nullable: true })
  operadorId: string;

  @ManyToOne(() => Operador, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'operador_id' })
  operador?: Operador;

  @Column({ type: 'enum', enum: EstadoEjecucion, default: EstadoEjecucion.INICIADA })
  estado: EstadoEjecucion;

  @Column({ type: 'timestamp', name: 'fecha_inicio' })
  fechaInicio: Date;

  @Column({ type: 'timestamp', name: 'fecha_fin', nullable: true })
  fechaFin: Date;

  @Column({ type: 'decimal', precision: 12, scale: 3, name: 'cantidad_ejecutada', default: 0 })
  cantidadEjecutada: number;

  @Column({ type: 'decimal', precision: 12, scale: 3, name: 'cantidad_rechazada', default: 0 })
  cantidadRechazada: number;

  @Column({ type: 'jsonb', nullable: true })
  parametros: any;

  @Column({ type: 'jsonb', nullable: true })
  paradas: any;

  @Column({ type: 'text', nullable: true })
  observaciones: string;
}