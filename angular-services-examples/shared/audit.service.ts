// src/app/services/audit.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  AuditRecord,
  AuditFilters,
  PaginatedAuditResponse,
} from '../models/audit.model';

@Injectable({
  providedIn: 'root',
})
export class AuditService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/audit`;

  // ─── Estado reactivo para el historial de la entidad actual ─────────────────
  historialEntidad = signal<AuditRecord[]>([]);
  cargando = signal<boolean>(false);
  error = signal<string | null>(null);

  // ─── Obtener auditoría de una entidad específica ────────────────────────────
  /**
   * Consulta el historial de auditoría de una entidad concreta.
   * Actualiza la señal `historialEntidad` automáticamente.
   *
   * @param entityType  Nombre del tipo de entidad (ej: 'Empresa', 'Machine')
   * @param entityId    UUID del registro
   */
  cargarHistorialEntidad(
    entityType: string,
    entityId: string,
  ): Observable<AuditRecord[]> {
    this.cargando.set(true);
    this.error.set(null);

    return this.http
      .get<AuditRecord[]>(`${this.apiUrl}/entity/${entityType}/${entityId}`)
      .pipe(
        tap((records) => {
          this.historialEntidad.set(records);
          this.cargando.set(false);
        }),
        catchError((err) => {
          this.error.set('No se pudo cargar el historial de auditoría.');
          this.cargando.set(false);
          return of([]);
        }),
      );
  }

  // ─── Consulta filtrada / paginada (para vistas de auditoría global) ─────────
  obtenerTodos(filters: AuditFilters = {}): Observable<PaginatedAuditResponse> {
    let params = new HttpParams();
    if (filters.entityType) params = params.set('entityType', filters.entityType);
    if (filters.entityId)   params = params.set('entityId', filters.entityId);
    if (filters.action)     params = params.set('action', filters.action);
    if (filters.userId)     params = params.set('userId', filters.userId);
    if (filters.module)     params = params.set('module', filters.module);
    if (filters.startDate)  params = params.set('startDate', filters.startDate);
    if (filters.endDate)    params = params.set('endDate', filters.endDate);
    if (filters.page)       params = params.set('page', String(filters.page));
    if (filters.limit)      params = params.set('limit', String(filters.limit));

    return this.http.get<PaginatedAuditResponse>(this.apiUrl, { params });
  }

  // ─── Limpiar estado ──────────────────────────────────────────────────────────
  limpiarHistorial(): void {
    this.historialEntidad.set([]);
    this.error.set(null);
  }
}
