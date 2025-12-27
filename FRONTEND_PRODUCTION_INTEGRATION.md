# 🏭 Guía de Integración - Módulo de Producción (Frontend)

## 📋 Resumen

Esta guía documenta la integración completa del módulo de producción del frontend Angular con el backend NestJS.

---

## ✅ Archivos Creados

### 1. Modelos (`src/app/shared/models/`)

#### `common.model.ts`
```typescript
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
```

#### `production-order.model.ts`
- ✅ `ProductionOrder` interface
- ✅ `ProductionOrderStatus` enum
- ✅ `CreateProductionOrderDto`
- ✅ `UpdateProductionOrderDto`
- ✅ `ProductionOrderFilters`
- ✅ `ProductionOrderOperation`

### 2. Servicios (`src/app/features/production/services/`)

#### `production-order.service.ts`
Servicio completo con:
- ✅ Signals para estado reactivo (loading, error, currentOrder)
- ✅ CRUD completo
- ✅ Filtros y paginación
- ✅ Cambio de estado
- ✅ Métodos helper (getActive, getPlanned, search)

### 3. Componente Actualizado

#### `orders-with-api.ts`
Componente actualizado para usar el servicio real:
- ✅ Integración con ProductionOrderService
- ✅ Carga de datos desde API
- ✅ Paginación
- ✅ Búsqueda
- ✅ CRUD completo
- ✅ Cambio de estados
- ✅ Manejo de errores

---

## 🎯 Endpoints del Backend Disponibles

### Órdenes de Producción

```typescript
// Listar órdenes con filtros
GET /production-orders?page=1&limit=20&status=PLANNED&search=OP-

// Obtener una orden
GET /production-orders/:id

// Crear orden
POST /production-orders
Body: CreateProductionOrderDto

// Actualizar orden
PATCH /production-orders/:id
Body: UpdateProductionOrderDto

// Cambiar estado
PATCH /production-orders/:id/status
Body: { status: 'IN_PROGRESS' }

// Eliminar orden (soft delete)
DELETE /production-orders/:id
```

---

## 🚀 Cómo Usar

### 1. Importar el servicio en tu componente

```typescript
import { ProductionOrderService } from '../services/production-order.service';
import { ProductionOrderStatus } from '../../../shared/models/production-order.model';

export class MyComponent implements OnInit {
  private productionOrderService = inject(ProductionOrderService);
  
  // Acceder a signals
  loading = this.productionOrderService.loading;
  error = this.productionOrderService.error;
  
  ngOnInit() {
    this.loadOrders();
  }
  
  loadOrders() {
    this.productionOrderService.getAll({ page: 1, limit: 20 }).subscribe({
      next: (response) => {
        console.log('Órdenes:', response.data);
        console.log('Total:', response.total);
      }
    });
  }
}
```

### 2. Crear una orden

```typescript
createOrder() {
  const newOrder: CreateProductionOrderDto = {
    code: 'OP-0001',
    productId: 'uuid-del-producto',
    routeId: 'uuid-de-la-ruta',
    quantityPlanned: 1000,
    priority: 1,
    dueDate: '2025-12-31',
    notes: 'Orden prioritaria'
  };

  this.productionOrderService.create(newOrder).subscribe({
    next: (order) => {
      console.log('Orden creada:', order);
      this.loadOrders(); // Recargar lista
    },
    error: (err) => {
      console.error('Error:', err);
    }
  });
}
```

### 3. Cambiar estado de una orden

```typescript
startOrder(orderId: string) {
  this.productionOrderService
    .updateStatus(orderId, ProductionOrderStatus.IN_PROGRESS)
    .subscribe({
      next: (order) => {
        console.log('Orden iniciada:', order);
      }
    });
}

completeOrder(orderId: string) {
  this.productionOrderService
    .updateStatus(orderId, ProductionOrderStatus.COMPLETED)
    .subscribe({
      next: (order) => {
        console.log('Orden completada:', order);
      }
    });
}
```

### 4. Filtrar órdenes

```typescript
// Por estado
getActiveOrders() {
  this.productionOrderService.getActive(1, 20).subscribe({
    next: (response) => {
      console.log('Órdenes activas:', response.data);
    }
  });
}

// Por búsqueda de texto
searchOrders(text: string) {
  this.productionOrderService.search(text, 1, 20).subscribe({
    next: (response) => {
      console.log('Resultados:', response.data);
    }
  });
}

// Con filtros personalizados
getFilteredOrders() {
  this.productionOrderService.getAll({
    status: ProductionOrderStatus.PLANNED,
    priority: 1,
    productId: 'uuid',
    page: 1,
    limit: 20
  }).subscribe({
    next: (response) => {
      console.log('Órdenes filtradas:', response.data);
    }
  });
}
```

### 5. Usar Signals para estado reactivo

```typescript
@Component({
  template: `
    <div>
      @if (loading()) {
        <p>Cargando...</p>
      }
      
      @if (error()) {
        <div class="alert alert-error">
          {{ error() }}
        </div>
      }
      
      @if (currentOrder(); as order) {
        <div class="order-details">
          <h3>{{ order.code }}</h3>
          <p>Estado: {{ order.status }}</p>
        </div>
      }
    </div>
  `
})
export class OrderDetailsComponent {
  private productionOrderService = inject(ProductionOrderService);
  
  loading = this.productionOrderService.loading;
  error = this.productionOrderService.error;
  currentOrder = this.productionOrderService.currentOrder;
  
  loadOrder(id: string) {
    this.productionOrderService.getOne(id).subscribe();
    // El currentOrder signal se actualiza automáticamente
  }
}
```

---

## 📊 Estados de Órdenes

```typescript
export enum ProductionOrderStatus {
  PLANNED = 'PLANNED',          // Planificada
  IN_PROGRESS = 'IN_PROGRESS',  // En proceso
  COMPLETED = 'COMPLETED',      // Completada
  CANCELLED = 'CANCELLED',      // Cancelada
  ON_HOLD = 'ON_HOLD'          // En espera
}
```

### Flujo de Estados

```
PLANNED -> IN_PROGRESS -> COMPLETED
            ↓
        ON_HOLD -> IN_PROGRESS
            ↓
        CANCELLED (final)
```

---

## 🎨 Clases de Badge por Estado

```typescript
badgeClass(status: ProductionOrderStatus): string {
  switch (status) {
    case ProductionOrderStatus.PLANNED:
      return 'ui-badge-info';      // Azul
    case ProductionOrderStatus.IN_PROGRESS:
      return 'ui-badge-warn';      // Amarillo/Naranja
    case ProductionOrderStatus.COMPLETED:
      return 'ui-badge-ok';        // Verde
    case ProductionOrderStatus.CANCELLED:
      return 'ui-badge-bad';       // Rojo
    case ProductionOrderStatus.ON_HOLD:
      return 'ui-badge';           // Gris
    default:
      return 'ui-badge';
  }
}
```

---

## 🔄 Paginación

```typescript
// En tu componente
currentPage = signal<number>(1);
pageSize = signal<number>(20);
total = signal<number>(0);

loadOrders() {
  this.productionOrderService.getAll({
    page: this.currentPage(),
    limit: this.pageSize()
  }).subscribe({
    next: (response) => {
      this.orders.set(response.data);
      this.total.set(response.total);
      
      // Información de paginación
      console.log('Página actual:', response.page);
      console.log('Total páginas:', response.totalPages);
      console.log('Tiene siguiente:', response.hasNextPage);
      console.log('Tiene anterior:', response.hasPrevPage);
    }
  });
}

nextPage() {
  if (this.hasNextPage()) {
    this.currentPage.update(p => p + 1);
    this.loadOrders();
  }
}

prevPage() {
  if (this.hasPrevPage()) {
    this.currentPage.update(p => p - 1);
    this.loadOrders();
  }
}
```

---

## ⚠️ Manejo de Errores

```typescript
// El servicio automáticamente captura errores y actualiza el signal
this.productionOrderService.create(newOrder).subscribe({
  error: (err) => {
    // El signal error ya está actualizado
    console.error('Error:', this.productionOrderService.error());
    
    // Mostrar mensaje al usuario
    this.showNotification(this.productionOrderService.error());
    
    // Limpiar error después de 5 segundos
    setTimeout(() => {
      this.productionOrderService.clearError();
    }, 5000);
  }
});
```

---

## 📝 Validaciones

### Campos Requeridos para Crear Orden

```typescript
interface CreateProductionOrderDto {
  code: string;              // ✅ REQUERIDO
  productId: string;         // ✅ REQUERIDO
  routeId: string;           // ✅ REQUERIDO
  quantityPlanned: number;   // ✅ REQUERIDO
  
  // Opcionales
  externalCode?: string;
  priority?: number;
  mainWorkCenterId?: string;
  shiftId?: string;
  plannedStartDate?: string;
  plannedEndDate?: string;
  dueDate?: string;
  notes?: string;
}
```

### Validación en el Formulario

```typescript
validateForm(): boolean {
  if (!this.form.code || this.form.code.trim() === '') {
    this.showError('El código es requerido');
    return false;
  }
  
  if (!this.form.productId) {
    this.showError('El producto es requerido');
    return false;
  }
  
  if (!this.form.routeId) {
    this.showError('La ruta es requerida');
    return false;
  }
  
  if (!this.form.quantityPlanned || this.form.quantityPlanned <= 0) {
    this.showError('La cantidad debe ser mayor a 0');
    return false;
  }
  
  return true;
}
```

---

## 🧪 Ejemplo Completo de Componente

```typescript
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductionOrderService } from '../services/production-order.service';
import {
  ProductionOrder,
  ProductionOrderStatus
} from '../../../shared/models/production-order.model';

@Component({
  standalone: true,
  selector: 'app-production-dashboard',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="production-dashboard">
      <h2>Dashboard de Producción</h2>
      
      <!-- Loading State -->
      @if (loading()) {
        <div class="loading">Cargando...</div>
      }
      
      <!-- Error State -->
      @if (error()) {
        <div class="error-message">
          {{ error() }}
          <button (click)="clearError()">✕</button>
        </div>
      }
      
      <!-- Statistics -->
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Planificadas</h3>
          <p>{{ plannedCount() }}</p>
        </div>
        <div class="stat-card">
          <h3>En Proceso</h3>
          <p>{{ activeCount() }}</p>
        </div>
        <div class="stat-card">
          <h3>Completadas Hoy</h3>
          <p>{{ completedToday() }}</p>
        </div>
      </div>
      
      <!-- Orders List -->
      <div class="orders-list">
        @for (order of orders(); track order.id) {
          <div class="order-card">
            <div class="order-header">
              <h4>{{ order.code }}</h4>
              <span [class]="badgeClass(order.status)">
                {{ order.status }}
              </span>
            </div>
            <div class="order-body">
              <p>Cantidad: {{ order.quantityProduced }} / {{ order.quantityPlanned }}</p>
              <div class="progress-bar">
                <div class="progress" 
                     [style.width.%]="calculateProgress(order)">
                </div>
              </div>
            </div>
            <div class="order-actions">
              @if (order.status === ProductionOrderStatus.PLANNED) {
                <button (click)="startOrder(order.id)">Iniciar</button>
              }
              @if (order.status === ProductionOrderStatus.IN_PROGRESS) {
                <button (click)="completeOrder(order.id)">Completar</button>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class ProductionDashboardComponent implements OnInit {
  private productionOrderService = inject(ProductionOrderService);
  
  // Signals
  orders = signal<ProductionOrder[]>([]);
  plannedCount = signal<number>(0);
  activeCount = signal<number>(0);
  completedToday = signal<number>(0);
  
  loading = this.productionOrderService.loading;
  error = this.productionOrderService.error;
  
  ProductionOrderStatus = ProductionOrderStatus;
  
  ngOnInit() {
    this.loadDashboardData();
  }
  
  loadDashboardData() {
    // Cargar órdenes activas
    this.productionOrderService.getActive(1, 20).subscribe({
      next: (response) => {
        this.orders.set(response.data);
        this.activeCount.set(response.total);
      }
    });
    
    // Cargar órdenes planificadas
    this.productionOrderService.getPlanned(1, 1).subscribe({
      next: (response) => {
        this.plannedCount.set(response.total);
      }
    });
  }
  
  startOrder(id: string) {
    this.productionOrderService
      .updateStatus(id, ProductionOrderStatus.IN_PROGRESS)
      .subscribe({
        next: () => this.loadDashboardData()
      });
  }
  
  completeOrder(id: string) {
    this.productionOrderService
      .updateStatus(id, ProductionOrderStatus.COMPLETED)
      .subscribe({
        next: () => this.loadDashboardData()
      });
  }
  
  calculateProgress(order: ProductionOrder): number {
    if (order.quantityPlanned === 0) return 0;
    return (order.quantityProduced / order.quantityPlanned) * 100;
  }
  
  badgeClass(status: ProductionOrderStatus): string {
    // ... implementación
  }
  
  clearError() {
    this.productionOrderService.clearError();
  }
}
```

---

## 🔗 Integración con Otros Módulos

### Productos y Rutas

Para los selects de productos y rutas, necesitarás crear servicios adicionales:

```typescript
// products.service.ts
@Injectable({ providedIn: 'root' })
export class ProductsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/products`;
  
  getAll() {
    return this.http.get<Product[]>(this.apiUrl);
  }
}

// routes.service.ts
@Injectable({ providedIn: 'root' })
export class RoutesService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/routes`;
  
  getAll() {
    return this.http.get<Route[]>(this.apiUrl);
  }
}
```

---

## ✅ Checklist de Integración

- [x] Modelos creados en `shared/models/`
- [x] Servicio `ProductionOrderService` implementado
- [x] Componente actualizado para usar servicio real
- [x] Signals configurados para estado reactivo
- [x] Paginación implementada
- [x] Filtros y búsqueda funcionando
- [x] CRUD completo
- [x] Cambio de estados
- [x] Manejo de errores
- [ ] Crear servicios para Products y Routes
- [ ] Implementar selects con datos reales
- [ ] Agregar validaciones de formulario
- [ ] Agregar confirmaciones de acciones
- [ ] Agregar notificaciones toast

---

## 🚀 Próximos Pasos

1. **Copiar archivos** del backend al frontend
2. **Actualizar componente** Orders con la versión nueva (orders-with-api.ts)
3. **Probar conexión** con el backend en `http://localhost:3000`
4. **Crear servicios** para Products, Routes, Machines, etc.
5. **Agregar validaciones** y mejoras de UX

¿Necesitas ayuda con algún paso específico?
