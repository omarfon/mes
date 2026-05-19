// src/app/services/work-centers.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuditService } from './audit.service';
import { AuditRecord } from '../models/audit.model';

const ENTITY_TYPE = 'WorkCenter';

export interface WorkCenter {
  id: string;
  code: string;
  name: string;
  description?: string;
  plantId?: string;
  areaId?: string;
  active: boolean;
  fechaCreacion: string;
  usuCreacion?: string;
  fechaEdicion: string;
  usuEdicion?: string;
}

export interface WorkCenterFilters {
  search?: string;
  active?: boolean;
  plantId?: string;
  areaId?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedWorkCenters {
  data: WorkCenter[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({ providedIn: 'root' })
export class WorkCentersService {
  private http = inject(HttpClient);
  private auditService = inject(AuditService);
  private apiUrl = `${environment.apiUrl}/master-data/work-centers`;

  getAll(filters: WorkCenterFilters = {}): Observable<PaginatedWorkCenters> {
    let params = new HttpParams();
    if (filters.search)   params = params.set('search',  filters.search);
    if (filters.active !== undefined) params = params.set('active', String(filters.active));
    if (filters.plantId)  params = params.set('plantId', filters.plantId);
    if (filters.areaId)   params = params.set('areaId',  filters.areaId);
    if (filters.page)     params = params.set('page',    String(filters.page));
    if (filters.limit)    params = params.set('limit',   String(filters.limit));
    return this.http.get<PaginatedWorkCenters>(this.apiUrl, { params });
  }

  getById(id: string): Observable<WorkCenter> {
    return this.http.get<WorkCenter>(`${this.apiUrl}/${id}`);
  }

  create(dto: Partial<WorkCenter>): Observable<WorkCenter> {
    return this.http.post<WorkCenter>(this.apiUrl, dto);
  }

  update(id: string, dto: Partial<WorkCenter>): Observable<WorkCenter> {
    return this.http.put<WorkCenter>(`${this.apiUrl}/${id}`, dto);
  }

  toggleActive(id: string, active: boolean): Observable<WorkCenter> {
    return this.http.patch<WorkCenter>(`${this.apiUrl}/${id}/active`, { active });
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  cargarAuditoria(id: string): Observable<AuditRecord[]> {
    return this.auditService.cargarHistorialEntidad(ENTITY_TYPE, id);
  }
}
