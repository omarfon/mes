// src/app/components/audit-history/audit-history.component.ts
import {
  Component,
  OnInit,
  OnChanges,
  OnDestroy,
  inject,
  input,
  signal,
  computed,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AuditService } from '../../services/audit.service';
import {
  AuditRecord,
  AUDIT_ACTION_LABELS,
  AUDIT_ACTION_CLASSES,
} from '../../models/audit.model';

@Component({
  selector: 'app-audit-history',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './audit-history.component.html',
})
export class AuditHistoryComponent implements OnInit, OnChanges, OnDestroy {
  // ─── Inputs ────────────────────────────────────────────────────────────────
  /** Nombre de la entidad tal como lo registra el backend (ej: 'Empresa', 'Machine') */
  entityType = input.required<string>();

  /** UUID del registro a consultar */
  entityId = input.required<string>();

  /** Título opcional para el panel */
  titulo = input<string>('Historial de Cambios');

  // ─── Dependencias ──────────────────────────────────────────────────────────
  private auditService = inject(AuditService);

  // ─── Estado local ──────────────────────────────────────────────────────────
  registros = signal<AuditRecord[]>([]);
  cargando = signal(false);
  error = signal<string | null>(null);
  expandido = signal<string | null>(null); // id del registro expandido

  // ─── Computed ─────────────────────────────────────────────────────────────
  tieneRegistros = computed(() => this.registros().length > 0);

  // ─── Labels y clases ──────────────────────────────────────────────────────
  readonly actionLabels = AUDIT_ACTION_LABELS;
  readonly actionClasses = AUDIT_ACTION_CLASSES;

  // ─── Lifecycle ────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.cargar();
  }

  ngOnChanges(): void {
    // Se recarga si cambia entityType o entityId
    if (this.entityType() && this.entityId()) {
      this.cargar();
    }
  }

  ngOnDestroy(): void {
    this.auditService.limpiarHistorial();
  }

  // ─── Métodos ──────────────────────────────────────────────────────────────
  cargar(): void {
    if (!this.entityType() || !this.entityId()) return;

    this.cargando.set(true);
    this.error.set(null);

    this.auditService
      .cargarHistorialEntidad(this.entityType(), this.entityId())
      .subscribe({
        next: (data) => {
          this.registros.set(data);
          this.cargando.set(false);
        },
        error: () => {
          this.error.set('No se pudo cargar el historial de auditoría.');
          this.cargando.set(false);
        },
      });
  }

  toggleDetalle(id: string): void {
    this.expandido.set(this.expandido() === id ? null : id);
  }

  estaExpandido(id: string): boolean {
    return this.expandido() === id;
  }

  /** Obtiene las claves que cambiaron entre oldValues y newValues */
  camposModificados(record: AuditRecord): string[] {
    if (!record.oldValues || !record.newValues) return [];
    const claves = new Set([
      ...Object.keys(record.oldValues),
      ...Object.keys(record.newValues),
    ]);
    return Array.from(claves).filter(
      (k) =>
        JSON.stringify(record.oldValues?.[k]) !==
        JSON.stringify(record.newValues?.[k]),
    );
  }

  nombreUsuario(record: AuditRecord): string {
    if (record.user?.name) return record.user.name;
    if (record.user?.email) return record.user.email;
    return 'Sistema';
  }

  clasePorAccion(record: AuditRecord): string {
    return this.actionClasses[record.action] ?? 'bg-gray-100 text-gray-700';
  }

  etiquetaAccion(record: AuditRecord): string {
    return this.actionLabels[record.action] ?? record.action;
  }

  objetoATexto(valor: any): string {
    if (valor === null || valor === undefined) return '—';
    if (typeof valor === 'object') return JSON.stringify(valor, null, 2);
    return String(valor);
  }
}
