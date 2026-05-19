import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

import { AuditableEntity } from '../../../common/entities/auditable.entity';
export enum TipoRegistroTiempo {
  INICIO = 'INICIO',
  FIN = 'FIN',
  PAUSA = 'PAUSA',
  REANUDACION = 'REANUDACION'
}

@Entity({ name: 'control_tiempos' })
export class ControlTiempo extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'orden_id' })
  @Index()
  ordenId: string;

  @Column({ type: 'uuid', name: 'ejecucion_id', nullable: true })
  ejecucionId: string;

  @Column({ type: 'uuid', name: 'operador_id', nullable: true })
  operadorId: string;

  @Column({ type: 'enum', enum: TipoRegistroTiempo })
  tipo: TipoRegistroTiempo;

  @Column({ type: 'timestamp' })
  timestamp: Date;

  @Column({ type: 'integer', name: 'duracion_minutos', nullable: true })
  duracionMinutos: number;

  @Column({ type: 'uuid', name: 'motivo_parada_id', nullable: true })
  motivoParadaId: string;

  @Column({ type: 'text', nullable: true })
  comentario: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;
}
