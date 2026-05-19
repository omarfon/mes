// src/app/services/areas.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuditService } from './audit.service';
import { AuditRecord } from '../models/audit.model';

const ENTITY_TYPE = 'Area';

export interface Area {
  id: string;
  code: string;
  name: string;
  description?: string;
  plantId?: string;
  active: boolean;
  fechaCreacion: string;
  usuCreacion?: string;
  fechaEdicion: string;
  usuEdicion?: string;
}

export interface AreaFilters {
  search?: string;
  active?: boolean;
  plantId?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedAreas {
  data: Area[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({ providedIn: 'root' })
export class AreasService {
  private http = inject(HttpClient);
  private auditService = inject(AuditService);
  private apiUrl = `${environment.apiUrl}/master-data/areas`;

  getAll(filters: AreaFilters = {}): Observable<PaginatedAreas> {
    let params = new HttpParams();
    if (filters.search)  params = params.set('search',  filters.search);
    if (filters.active !== undefined) params = params.set('active', String(filters.active));
    if (filters.plantId) params = params.set('plantId', filters.plantId);
    if (filters.page)    params = params.set('page',    String(filters.page));
    if (filters.limit)   params = params.set('limit',   String(filters.limit));
    return this.http.get<PaginatedAreas>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Area> {
    return this.http.get<Area>(`${this.apiUrl}/${id}`);
  }

  create(dto: Partial<Area>): Observable<Area> {
    return this.http.post<Area>(this.apiUrl, dto);
  }

  update(id: string, dto: Partial<Area>): Observable<Area> {
    return this.http.put<Area>(`${this.apiUrl}/${id}`, dto);
  }

  toggleActive(id: string, active: boolean): Observable<Area> {
    return this.http.patch<Area>(`${this.apiUrl}/${id}/active`, { active });
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  cargarAuditoria(id: string): Observable<AuditRecord[]> {
    return this.auditService.cargarHistorialEntidad(ENTITY_TYPE, id);
  }
}
