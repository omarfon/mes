import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity({ name: 'wip' })
export class WIP {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'orden_id' })
  @Index()
  ordenId: string;

  @Column({ type: 'uuid', name: 'producto_id' })
  productoId: string;

  @Column({ type: 'varchar', length: 200, name: 'producto_nombre' })
  productoNombre: string;

  @Column({ type: 'uuid', name: 'work_center_id', nullable: true })
  workCenterId: string;

  @Column({ type: 'varchar', length: 200, name: 'work_center_nombre', nullable: true })
  workCenterNombre: string;

  @Column({ type: 'decimal', precision: 12, scale: 3, name: 'cantidad_actual' })
  cantidadActual: number;

  @Column({ type: 'varchar', length: 50, name: 'unidad_medida' })
  unidadMedida: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lote: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  ubicacion: string;

  @Column({ type: 'timestamp', name: 'fecha_entrada' })
  fechaEntrada: Date;

  @Column({ type: 'timestamp', name: 'fecha_actualizacion', nullable: true })
  fechaActualizacion: Date;

  @Column({ type: 'jsonb', nullable: true })
  movimientos: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
