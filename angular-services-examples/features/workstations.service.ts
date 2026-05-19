// src/app/services/workstations.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuditService } from './audit.service';
import { AuditRecord } from '../models/audit.model';

const ENTITY_TYPE = 'Workstation';

export interface Workstation {
  id: string;
  code: string;
  name: string;
  description?: string;
  workCenterId?: string;
  active: boolean;
  fechaCreacion: string;
  usuCreacion?: string;
  fechaEdicion: string;
  usuEdicion?: string;
}

export interface WorkstationFilters {
  search?: string;
  active?: boolean;
  workCenterId?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedWorkstations {
  data: Workstation[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({ providedIn: 'root' })
export class WorkstationsService {
  private http = inject(HttpClient);
  private auditService = inject(AuditService);
  private apiUrl = `${environment.apiUrl}/master-data/workstations`;

  getAll(filters: WorkstationFilters = {}): Observable<PaginatedWorkstations> {
    let params = new HttpParams();
    if (filters.search)        params = params.set('search',       filters.search);
    if (filters.active !== undefined) params = params.set('active', String(filters.active));
    if (filters.workCenterId)  params = params.set('workCenterId', filters.workCenterId);
    if (filters.page)          params = params.set('page',         String(filters.page));
    if (filters.limit)         params = params.set('limit',        String(filters.limit));
    return this.http.get<PaginatedWorkstations>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Workstation> {
    return this.http.get<Workstation>(`${this.apiUrl}/${id}`);
  }

  create(dto: Partial<Workstation>): Observable<Workstation> {
    return this.http.post<Workstation>(this.apiUrl, dto);
  }

  update(id: string, dto: Partial<Workstation>): Observable<Workstation> {
    return this.http.put<Workstation>(`${this.apiUrl}/${id}`, dto);
  }

  toggleActive(id: string, active: boolean): Observable<Workstation> {
    return this.http.patch<Workstation>(`${this.apiUrl}/${id}/active`, { active });
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  cargarAuditoria(id: string): Observable<AuditRecord[]> {
    return this.auditService.cargarHistorialEntidad(ENTITY_TYPE, id);
  }
}
