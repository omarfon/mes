// src/app/services/unidades-medida.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuditService } from './audit.service';
import { AuditRecord } from '../models/audit.model';

const ENTITY_TYPE = 'UnidadMedida';

export interface UnidadMedida {
  id: string;
  code: string;
  name: string;
  symbol: string;
  active: boolean;
  fechaCreacion: string;
  usuCreacion?: string;
  fechaEdicion: string;
  usuEdicion?: string;
}

export interface UnidadMedidaFilters {
  search?: string;
  active?: boolean;
  page?: number;
  limit?: number;
}

export interface PaginatedUnidadesMedida {
  data: UnidadMedida[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({ providedIn: 'root' })
export class UnidadesMedidaService {
  private http = inject(HttpClient);
  private auditService = inject(AuditService);
  private apiUrl = `${environment.apiUrl}/master-data/unidades-medida`;

  getAll(filters: UnidadMedidaFilters = {}): Observable<PaginatedUnidadesMedida> {
    let params = new HttpParams();
    if (filters.search) params = params.set('search', filters.search);
    if (filters.active !== undefined) params = params.set('active', String(filters.active));
    if (filters.page)  params = params.set('page',  String(filters.page));
    if (filters.limit) params = params.set('limit', String(filters.limit));
    return this.http.get<PaginatedUnidadesMedida>(this.apiUrl, { params });
  }

  getById(id: string): Observable<UnidadMedida> {
    return this.http.get<UnidadMedida>(`${this.apiUrl}/${id}`);
  }

  create(dto: Partial<UnidadMedida>): Observable<UnidadMedida> {
    return this.http.post<UnidadMedida>(this.apiUrl, dto);
  }

  update(id: string, dto: Partial<UnidadMedida>): Observable<UnidadMedida> {
    return this.http.put<UnidadMedida>(`${this.apiUrl}/${id}`, dto);
  }

  toggleActive(id: string, active: boolean): Observable<UnidadMedida> {
    return this.http.patch<UnidadMedida>(`${this.apiUrl}/${id}/active`, { active });
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  cargarAuditoria(id: string): Observable<AuditRecord[]> {
    return this.auditService.cargarHistorialEntidad(ENTITY_TYPE, id);
  }
}
