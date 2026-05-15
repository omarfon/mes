// src/app/services/empresas.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Empresa,
  EmpresaSelectItem,
  CreateEmpresaDto,
  UpdateEmpresaDto,
  EmpresaFilters,
} from '../models/empresa.model';

export interface PaginatedEmpresas {
  data: Empresa[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({
  providedIn: 'root',
})
export class EmpresasService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/master-data/empresas`;

  /** Lista reactiva para selectores (estudio de factibilidad, etc.) */
  selectList = signal<EmpresaSelectItem[]>([]);

  // ─── Selector ──────────────────────────────────────────────────────────────

  /**
   * Carga el listado ligero id/ruc/name para poblar un <select> o autocomplete.
   * Actualiza la señal `selectList` automáticamente.
   */
  loadSelectList(search?: string): Observable<EmpresaSelectItem[]> {
    let params = new HttpParams();
    if (search) {
      params = params.set('search', search);
    }
    return this.http
      .get<EmpresaSelectItem[]>(`${this.apiUrl}/list`, { params })
      .pipe(tap((items) => this.selectList.set(items)));
  }

  // ─── CRUD ───────────────────────────────────────────────────────────────────

  getAll(filters: EmpresaFilters = {}): Observable<PaginatedEmpresas> {
    let params = new HttpParams();
    if (filters.search) params = params.set('search', filters.search);
    if (filters.active !== undefined)
      params = params.set('active', String(filters.active));
    if (filters.page) params = params.set('page', String(filters.page));
    if (filters.limit) params = params.set('limit', String(filters.limit));

    return this.http.get<PaginatedEmpresas>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Empresa> {
    return this.http.get<Empresa>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateEmpresaDto): Observable<Empresa> {
    return this.http.post<Empresa>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateEmpresaDto): Observable<Empresa> {
    return this.http.put<Empresa>(`${this.apiUrl}/${id}`, dto);
  }

  toggleActive(id: string, active: boolean): Observable<Empresa> {
    return this.http.patch<Empresa>(`${this.apiUrl}/${id}/active`, { active });
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
