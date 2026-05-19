import {
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
} from 'typeorm';

/**
 * AuditableEntity
 * ─────────────────────────────────────────────────────────────────
 * Clase base abstracta que agrega los 6 campos de auditoría a todas
 * las entidades que la extiendan:
 *
 *   usuCreacion  + fechaCreacion  → quién y cuándo creó el registro
 *   usuEdicion   + fechaEdicion   → quién y cuándo editó por última vez
 *   usuEliminacion + fechaEliminacion → quién y cuándo eliminó (soft delete)
 *
 * Los campos usu_* se rellenan automáticamente mediante AuditSubscriber
 * leyendo el contexto de usuario inyectado por AuditContextInterceptor.
 * ─────────────────────────────────────────────────────────────────
 */
export abstract class AuditableEntity {
  // ── Creación ──────────────────────────────────────────────────
  /** Mapea al existente 'created_at' — no requiere migración de columna */
  @CreateDateColumn({ name: 'created_at' })
  fechaCreacion: Date;

  @Column({ name: 'usu_creacion', type: 'varchar', length: 200, nullable: true })
  usuCreacion: string | null;

  // ── Edición ───────────────────────────────────────────────────
  /** Mapea al existente 'updated_at' — no requiere migración de columna */
  @UpdateDateColumn({ name: 'updated_at' })
  fechaEdicion: Date;

  @Column({ name: 'usu_edicion', type: 'varchar', length: 200, nullable: true })
  usuEdicion: string | null;

  // ── Eliminación (soft delete) ─────────────────────────────────
  /** Mapea al existente 'deleted_at' — no requiere migración de columna */
  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  fechaEliminacion: Date | null;

  @Column({ name: 'usu_eliminacion', type: 'varchar', length: 200, nullable: true })
  usuEliminacion: string | null;
}
