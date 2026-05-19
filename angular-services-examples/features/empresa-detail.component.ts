// src/app/pages/maestros/empresa-detail/empresa-detail.component.ts
//
// ──────────────────────────────────────────────────────────────────────────────
// EJEMPLO DE USO: Componente de detalle de empresa con historial de auditoría
//
// Patrón replicable en TODOS los maestros:
//   1. Inyectar el servicio del maestro
//   2. Cargar el detalle del registro
//   3. Agregar <app-audit-history> al template pasando entityType y entityId
// ──────────────────────────────────────────────────────────────────────────────

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EmpresasService } from '../../services/empresas.service';
import { Empresa } from '../../models/empresa.model';
import { AuditHistoryComponent } from '../../components/audit-history/audit-history.component';

@Component({
  selector: 'app-empresa-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, AuditHistoryComponent],
  template: `
    @if (cargando()) {
      <div class="flex justify-center py-12 text-gray-400">Cargando...</div>
    }

    @if (!cargando() && empresa()) {
      <div class="max-w-4xl mx-auto px-4 py-6 space-y-6">

        <!-- Cabecera -->
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-bold text-gray-800">{{ empresa()!.name }}</h1>
          <a routerLink="/maestros/empresas"
             class="text-sm text-blue-600 hover:underline">
            ← Volver al listado
          </a>
        </div>

        <!-- Datos del registro -->
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 grid grid-cols-2 gap-4">
          <div>
            <p class="text-xs text-gray-500 uppercase tracking-wide">RUC</p>
            <p class="font-medium text-gray-800">{{ empresa()!.ruc }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 uppercase tracking-wide">Email</p>
            <p class="font-medium text-gray-800">{{ empresa()!.email || '—' }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 uppercase tracking-wide">Teléfono</p>
            <p class="font-medium text-gray-800">{{ empresa()!.phone || '—' }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 uppercase tracking-wide">Estado</p>
            <span
              class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
              [class]="empresa()!.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
            >
              {{ empresa()!.active ? 'Activo' : 'Inactivo' }}
            </span>
          </div>
          <!-- Campos de auditoría rápida (de AuditableEntity) -->
          <div>
            <p class="text-xs text-gray-500 uppercase tracking-wide">Creado por</p>
            <p class="text-sm text-gray-600">
              {{ empresa()!['usuCreacion'] || '—' }}
              <span class="text-gray-400 ml-1">
                {{ empresa()!.createdAt | date:'dd/MM/yyyy HH:mm' }}
              </span>
            </p>
          </div>
          <div>
            <p class="text-xs text-gray-500 uppercase tracking-wide">Última edición</p>
            <p class="text-sm text-gray-600">
              {{ empresa()!['usuEdicion'] || '—' }}
              <span class="text-gray-400 ml-1">
                {{ empresa()!.updatedAt | date:'dd/MM/yyyy HH:mm' }}
              </span>
            </p>
          </div>
        </div>

        <!-- ✅ Historial de auditoría completo — solo agregar esto a cualquier maestro -->
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <app-audit-history
            entityType="Empresa"
            [entityId]="empresa()!.id"
            titulo="Historial de Cambios"
          />
        </div>

      </div>
    }
  `,
})
export class EmpresaDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private empresasService = inject(EmpresasService);

  empresa = signal<Empresa | null>(null);
  cargando = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.cargando.set(true);
    this.empresasService.getById(id).subscribe({
      next: (data) => {
        this.empresa.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }
}
