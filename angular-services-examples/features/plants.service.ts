// src/app/services/plants.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuditService } from './audit.service';
import { AuditRecord } from '../models/audit.model';

const ENTITY_TYPE = 'Plant';

export interface Plant {
  id: string;
  code: string;
  name: string;
  description?: string;
  address?: string;
  active: boolean;
  fechaCreacion: string;
  usuCreacion?: string;
  fechaEdicion: string;
  usuEdicion?: string;
}

export interface PlantFilters {
  search?: string;
  active?: boolean;
  page?: number;
  limit?: number;
}

export interface PaginatedPlants {
  data: Plant[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({ providedIn: 'root' })
export class PlantsService {
  private http = inject(HttpClient);
  private auditService = inject(AuditService);
  private apiUrl = `${environment.apiUrl}/master-data/plants`;

  getAll(filters: PlantFilters = {}): Observable<PaginatedPlants> {
    let params = new HttpParams();
    if (filters.search) params = params.set('search', filters.search);
    if (filters.active !== undefined) params = params.set('active', String(filters.active));
    if (filters.page)  params = params.set('page',  String(filters.page));
    if (filters.limit) params = params.set('limit', String(filters.limit));
    return this.http.get<PaginatedPlants>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Plant> {
    return this.http.get<Plant>(`${this.apiUrl}/${id}`);
  }

  create(dto: Partial<Plant>): Observable<Plant> {
    return this.http.post<Plant>(this.apiUrl, dto);
  }

  update(id: string, dto: Partial<Plant>): Observable<Plant> {
    return this.http.put<Plant>(`${this.apiUrl}/${id}`, dto);
  }

  toggleActive(id: string, active: boolean): Observable<Plant> {
    return this.http.patch<Plant>(`${this.apiUrl}/${id}/active`, { active });
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  cargarAuditoria(id: string): Observable<AuditRecord[]> {
    return this.auditService.cargarHistorialEntidad(ENTITY_TYPE, id);
  }
}
