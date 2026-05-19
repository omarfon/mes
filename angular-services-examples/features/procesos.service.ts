// src/app/services/procesos.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuditService } from './audit.service';
import { AuditRecord } from '../models/audit.model';

const ENTITY_TYPE = 'Process';

export interface Proceso {
  id: string;
  code: string;
  name: string;
  description?: string;
  active: boolean;
  fechaCreacion: string;
  usuCreacion?: string;
  fechaEdicion: string;
  usuEdicion?: string;
}

export interface ProcesoFilters {
  search?: string;
  active?: boolean;
  page?: number;
  limit?: number;
}

export interface PaginatedProcesos {
  data: Proceso[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({ providedIn: 'root' })
export class ProcesosService {
  private http = inject(HttpClient);
  private auditService = inject(AuditService);
  private apiUrl = `${environment.apiUrl}/master-data/procesos`;

  getAll(filters: ProcesoFilters = {}): Observable<PaginatedProcesos> {
    let params = new HttpParams();
    if (filters.search) params = params.set('search', filters.search);
    if (filters.active !== undefined) params = params.set('active', String(filters.active));
    if (filters.page)  params = params.set('page',  String(filters.page));
    if (filters.limit) params = params.set('limit', String(filters.limit));
    return this.http.get<PaginatedProcesos>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Proceso> {
    return this.http.get<Proceso>(`${this.apiUrl}/${id}`);
  }

  create(dto: Partial<Proceso>): Observable<Proceso> {
    return this.http.post<Proceso>(this.apiUrl, dto);
  }

  update(id: string, dto: Partial<Proceso>): Observable<Proceso> {
    return this.http.put<Proceso>(`${this.apiUrl}/${id}`, dto);
  }

  toggleActive(id: string, active: boolean): Observable<Proceso> {
    return this.http.patch<Proceso>(`${this.apiUrl}/${id}/active`, { active });
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  cargarAuditoria(id: string): Observable<AuditRecord[]> {
    return this.auditService.cargarHistorialEntidad(ENTITY_TYPE, id);
  }
}
