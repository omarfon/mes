// src/app/services/motivos-parada.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuditService } from './audit.service';
import { AuditRecord } from '../models/audit.model';

const ENTITY_TYPE = 'MotivoParada';

export interface MotivoParada {
  id: string;
  code: string;
  name: string;
  description?: string;
  type?: string;
  active: boolean;
  fechaCreacion: string;
  usuCreacion?: string;
  fechaEdicion: string;
  usuEdicion?: string;
}

export interface MotivoParadaFilters {
  search?: string;
  active?: boolean;
  type?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedMotivosParada {
  data: MotivoParada[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({ providedIn: 'root' })
export class MotivosParadaService {
  private http = inject(HttpClient);
  private auditService = inject(AuditService);
  private apiUrl = `${environment.apiUrl}/master-data/motivos-parada`;

  getAll(filters: MotivoParadaFilters = {}): Observable<PaginatedMotivosParada> {
    let params = new HttpParams();
    if (filters.search) params = params.set('search', filters.search);
    if (filters.active !== undefined) params = params.set('active', String(filters.active));
    if (filters.type)  params = params.set('type',  filters.type);
    if (filters.page)  params = params.set('page',  String(filters.page));
    if (filters.limit) params = params.set('limit', String(filters.limit));
    return this.http.get<PaginatedMotivosParada>(this.apiUrl, { params });
  }

  getById(id: string): Observable<MotivoParada> {
    return this.http.get<MotivoParada>(`${this.apiUrl}/${id}`);
  }

  create(dto: Partial<MotivoParada>): Observable<MotivoParada> {
    return this.http.post<MotivoParada>(this.apiUrl, dto);
  }

  update(id: string, dto: Partial<MotivoParada>): Observable<MotivoParada> {
    return this.http.put<MotivoParada>(`${this.apiUrl}/${id}`, dto);
  }

  toggleActive(id: string, active: boolean): Observable<MotivoParada> {
    return this.http.patch<MotivoParada>(`${this.apiUrl}/${id}/active`, { active });
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  cargarAuditoria(id: string): Observable<AuditRecord[]> {
    return this.auditService.cargarHistorialEntidad(ENTITY_TYPE, id);
  }
}
