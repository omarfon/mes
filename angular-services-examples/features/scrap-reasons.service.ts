// src/app/services/scrap-reasons.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuditService } from './audit.service';
import { AuditRecord } from '../models/audit.model';

const ENTITY_TYPE = 'ScrapReason';

export interface ScrapReason {
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

export interface ScrapReasonFilters {
  search?: string;
  active?: boolean;
  page?: number;
  limit?: number;
}

export interface PaginatedScrapReasons {
  data: ScrapReason[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({ providedIn: 'root' })
export class ScrapReasonsService {
  private http = inject(HttpClient);
  private auditService = inject(AuditService);
  private apiUrl = `${environment.apiUrl}/master-data/scrap-reasons`;

  getAll(filters: ScrapReasonFilters = {}): Observable<PaginatedScrapReasons> {
    let params = new HttpParams();
    if (filters.search) params = params.set('search', filters.search);
    if (filters.active !== undefined) params = params.set('active', String(filters.active));
    if (filters.page)  params = params.set('page',  String(filters.page));
    if (filters.limit) params = params.set('limit', String(filters.limit));
    return this.http.get<PaginatedScrapReasons>(this.apiUrl, { params });
  }

  getById(id: string): Observable<ScrapReason> {
    return this.http.get<ScrapReason>(`${this.apiUrl}/${id}`);
  }

  create(dto: Partial<ScrapReason>): Observable<ScrapReason> {
    return this.http.post<ScrapReason>(this.apiUrl, dto);
  }

  update(id: string, dto: Partial<ScrapReason>): Observable<ScrapReason> {
    return this.http.put<ScrapReason>(`${this.apiUrl}/${id}`, dto);
  }

  toggleActive(id: string, active: boolean): Observable<ScrapReason> {
    return this.http.patch<ScrapReason>(`${this.apiUrl}/${id}/active`, { active });
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  cargarAuditoria(id: string): Observable<AuditRecord[]> {
    return this.auditService.cargarHistorialEntidad(ENTITY_TYPE, id);
  }
}
