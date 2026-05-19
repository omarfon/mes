// src/app/services/operadores.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuditService } from './audit.service';
import { AuditRecord } from '../models/audit.model';

const ENTITY_TYPE = 'Operator';

export interface Operador {
  id: string;
  code: string;
  name: string;
  lastName?: string;
  document?: string;
  active: boolean;
  fechaCreacion: string;
  usuCreacion?: string;
  fechaEdicion: string;
  usuEdicion?: string;
}

export interface OperadorFilters {
  search?: string;
  active?: boolean;
  page?: number;
  limit?: number;
}

export interface PaginatedOperadores {
  data: Operador[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({ providedIn: 'root' })
export class OperadoresService {
  private http = inject(HttpClient);
  private auditService = inject(AuditService);
  private apiUrl = `${environment.apiUrl}/master-data/operadores`;

  getAll(filters: OperadorFilters = {}): Observable<PaginatedOperadores> {
    let params = new HttpParams();
    if (filters.search) params = params.set('search', filters.search);
    if (filters.active !== undefined) params = params.set('active', String(filters.active));
    if (filters.page)  params = params.set('page',  String(filters.page));
    if (filters.limit) params = params.set('limit', String(filters.limit));
    return this.http.get<PaginatedOperadores>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Operador> {
    return this.http.get<Operador>(`${this.apiUrl}/${id}`);
  }

  create(dto: Partial<Operador>): Observable<Operador> {
    return this.http.post<Operador>(this.apiUrl, dto);
  }

  update(id: string, dto: Partial<Operador>): Observable<Operador> {
    return this.http.put<Operador>(`${this.apiUrl}/${id}`, dto);
  }

  toggleActive(id: string, active: boolean): Observable<Operador> {
    return this.http.patch<Operador>(`${this.apiUrl}/${id}/active`, { active });
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  cargarAuditoria(id: string): Observable<AuditRecord[]> {
    return this.auditService.cargarHistorialEntidad(ENTITY_TYPE, id);
  }
}
