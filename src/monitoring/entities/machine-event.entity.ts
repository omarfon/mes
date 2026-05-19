import { AuditableEntity } from '../../common/entities/auditable.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    Index
} from 'typeorm';
import { Machine } from '../../master-data/machines/entities/machines.entity';

@Entity({ name: 'machine_events' })
@Index(['machineId', 'timestamp']) // Índice para búsquedas rápidas por tiempo
export class MachineEvent extends AuditableEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'machine_id', type: 'uuid' })
    machineId: string;

    @ManyToOne(() => Machine, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'machine_id' })
    machine: Machine;

    /**
     * Estado reportado (ej. ACTIVE, STOPPED, ERROR)
     */
    @Column({ type: 'varchar', length: 50 })
    status: string;

    /**
     * Código de motivo de paro o error (opcional)
     */
    @Column({ name: 'reason_code', type: 'varchar', length: 50, nullable: true })
    reasonCode?: string;

    /**
     * Datos adicionales del evento (temperatura, velocidad, etc.)
     */
    @Column({ type: 'jsonb', nullable: true })
    metadata?: Record<string, any>;

    /**
     * Fecha y hora exacta del evento
     */
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    timestamp: Date;
}
