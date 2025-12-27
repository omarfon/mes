# Gu\u00eda Completa de Servicios Angular para MES Frontend

## \ud83d\udcdd Tabla de Contenidos

1. [Configuraci\u00f3n Inicial](#configuraci\u00f3n-inicial)
2. [Modelos/Interfaces TypeScript](#modelosinterfaces-typescript)
3. [Servicios Angular](#servicios-angular)
4. [Interceptores](#interceptores)
5. [Guards](#guards)
6. [Ejemplos de Uso en Componentes](#ejemplos-de-uso-en-componentes)

---

## Configuraci\u00f3n Inicial

### 1. Environment Configuration

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  apiDocsUrl: 'http://localhost:3000/api/docs'
};

// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.produccion.com',
  apiDocsUrl: 'https://api.produccion.com/api/docs'
};
```

### 2. App Configuration

```typescript
// src/app/app.config.ts (Angular 17+)
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';
import { errorInterceptor } from './interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor])
    )
  ]
};
```

---

## Modelos/Interfaces TypeScript

### src/app/models/common.model.ts

```typescript
// Paginaci\u00f3n
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}
```

### src/app/models/notification.model.ts

```typescript
export enum NotificationType {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS'
}

export enum NotificationCategory {
  PRODUCTION = 'PRODUCTION',
  MACHINE = 'MACHINE',
  QUALITY = 'QUALITY',
  MAINTENANCE = 'MAINTENANCE',
  SYSTEM = 'SYSTEM'
}

export interface Notification {
  id: string;
  userId: string | null;
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  isRead: boolean;
  relatedEntityType: string | null;
  relatedEntityId: string | null;
  metadata: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNotificationDto {
  userId?: string;
  title: string;
  message: string;
  type?: NotificationType;
  category?: NotificationCategory;
  relatedEntityType?: string;
  relatedEntityId?: string;
  metadata?: any;
}
```

### src/app/models/dashboard.model.ts

```typescript
export interface DashboardKPIs {
  production: {
    activeOrders: number;
    completedToday: number;
    plannedOrders: number;
    delayedOrders: number;
    totalQuantityProduced: number;
  };
  machines: {
    total: number;
    active: number;
    inactive: number;
    maintenance: number;
    utilizationRate: number;
  };
  efficiency: {
    oee: number;
    performance: number;
    quality: number;
    availability: number;
  };
}

export interface ProductionTrend {
  date: string;
  planned: number;
  produced: number;
  efficiency: number;
}

export interface OrderStatusSummary {
  status: string;
  count: number;
}
```

### src/app/models/activity-log.model.ts

```typescript
export enum ActivityAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  STATUS_CHANGE = 'STATUS_CHANGE',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT'
}

export enum ActivityModule {
  AUTH = 'AUTH',
  PRODUCTION_ORDER = 'PRODUCTION_ORDER',
  MACHINE = 'MACHINE',
  PRODUCT = 'PRODUCT',
  USER = 'USER',
  WORK_CENTER = 'WORK_CENTER',
  QUALITY = 'QUALITY',
  TRACEABILITY = 'TRACEABILITY',
  NOTIFICATION = 'NOTIFICATION',
  REPORT = 'REPORT',
  SYSTEM = 'SYSTEM'
}

export interface ActivityLog {
  id: string;
  userId: string | null;
  userEmail: string | null;
  userName: string | null;
  module: ActivityModule;
  action: ActivityAction;
  entityType: string;
  entityId: string | null;
  entityName: string | null;
  description: string;
  ipAddress: string | null;
  userAgent: string | null;
  oldValues: any;
  newValues: any;
  metadata: any;
  createdAt: Date;
}

export interface ActivityLogFilters extends PaginationParams {
  userId?: string;
  module?: ActivityModule;
  action?: ActivityAction;
  entityType?: string;
  entityId?: string;
  startDate?: string;
  endDate?: string;
}
```

### src/app/models/production-order.model.ts

```typescript
export enum ProductionOrderStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  ON_HOLD = 'ON_HOLD'
}

export interface ProductionOrder {
  id: string;
  code: string;
  externalCode?: string;
  productId: string;
  routeId: string;
  quantityPlanned: number;
  quantityProduced: number;
  status: ProductionOrderStatus;
  priority?: number;
  plannedStartDate?: Date;
  plannedEndDate?: Date;
  dueDate?: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  product?: any;
  route?: any;
  mainWorkCenter?: any;
  shift?: any;
}

export interface CreateProductionOrderDto {
  code: string;
  externalCode?: string;
  productId: string;
  routeId: string;
  quantityPlanned: number;
  priority?: number;
  mainWorkCenterId?: string;
  shiftId?: string;
  plannedStartDate?: string;
  plannedEndDate?: string;
  dueDate?: string;
  notes?: string;
}

export interface ProductionOrderFilters extends PaginationParams {
  productId?: string;
  routeId?: string;
  mainWorkCenterId?: string;
  status?: ProductionOrderStatus;
  priority?: number;
  search?: string;
}
```

### src/app/models/machine.model.ts

```typescript
export enum MachineStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE'
}

export interface Machine {
  id: string;
  code: string;
  name: string;
  description?: string;
  type?: string;
  model?: string;
  serialNumber?: string;
  area?: string;
  location?: string;
  nominalCapacity?: number;
  status: MachineStatus;
  isCritical: boolean;
  workCenterId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMachineDto {
  code: string;
  name: string;
  description?: string;
  type?: string;
  model?: string;
  serialNumber?: string;
  area?: string;
  location?: string;
  nominalCapacity?: number;
  workCenterId?: string;
  status?: MachineStatus;
  isCritical?: boolean;
}
```

### src/app/models/auth.model.ts

```typescript
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
}
```

---

## Servicios Angular

### src/app/services/auth.service.ts

```typescript
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse, LoginDto, RegisterDto, User } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/auth`;

  // Se\u00f1ales para estado reactivo
  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);

  constructor() {
    this.checkAuthStatus();
  }

  login(credentials: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.access_token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.currentUser.set(response.user);
          this.isAuthenticated.set(true);
        })
      );
  }

  register(data: RegisterDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.access_token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.currentUser.set(response.user);
          this.isAuthenticated.set(true);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private checkAuthStatus(): void {
    const token = this.getToken();
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      this.currentUser.set(JSON.parse(userStr));
      this.isAuthenticated.set(true);
    }
  }
}
```

### src/app/services/dashboard.service.ts

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
  DashboardKPIs, 
  ProductionTrend, 
  OrderStatusSummary 
} from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/dashboard`;

  getKPIs(): Observable<DashboardKPIs> {
    return this.http.get<DashboardKPIs>(`${this.apiUrl}/kpis`);
  }

  getProductionTrend(days: number = 7): Observable<ProductionTrend[]> {
    const params = new HttpParams().set('days', days.toString());
    return this.http.get<ProductionTrend[]>(`${this.apiUrl}/production-trend`, { params });
  }

  getOrdersByStatus(): Observable<OrderStatusSummary[]> {
    return this.http.get<OrderStatusSummary[]>(`${this.apiUrl}/orders-by-status`);
  }
}
```

### src/app/services/notifications.service.ts

```typescript
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, interval, switchMap, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
  Notification, 
  CreateNotificationDto,
  NotificationType,
  NotificationCategory
} from '../models/notification.model';
import { PaginatedResponse } from '../models/common.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/notifications`;

  // Contador de notificaciones no le\u00eddas
  unreadCount = signal<number>(0);

  getNotifications(
    userId: string, 
    isRead?: boolean,
    page: number = 1,
    limit: number = 20
  ): Observable<PaginatedResponse<Notification>> {
    let params = new HttpParams()
      .set('userId', userId)
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    if (isRead !== undefined) {
      params = params.set('isRead', isRead.toString());
    }
    
    return this.http.get<PaginatedResponse<Notification>>(this.apiUrl, { params });
  }

  create(dto: CreateNotificationDto): Observable<Notification> {
    return this.http.post<Notification>(this.apiUrl, dto);
  }

  getUnreadCount(userId: string): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/unread-count/${userId}`)
      .pipe(
        tap(response => this.unreadCount.set(response.count))
      );
  }

  markAsRead(id: string): Observable<Notification> {
    return this.http.patch<Notification>(`${this.apiUrl}/${id}/read`, {});
  }

  markAllAsRead(userId: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/mark-all-read/${userId}`, {})
      .pipe(
        tap(() => this.unreadCount.set(0))
      );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Polling para actualizar contador autom\u00e1ticamente
  startPollingUnreadCount(userId: string, intervalMs: number = 30000): Observable<{ count: number }> {
    return interval(intervalMs).pipe(
      switchMap(() => this.getUnreadCount(userId))
    );
  }
}
```

### src/app/services/activity-log.service.ts

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
  ActivityLog, 
  ActivityLogFilters,
  ActivityAction,
  ActivityModule 
} from '../models/activity-log.model';
import { PaginatedResponse } from '../models/common.model';

@Injectable({
  providedIn: 'root'
})
export class ActivityLogService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/activity-log`;

  getActivityLogs(filters: ActivityLogFilters): Observable<PaginatedResponse<ActivityLog>> {
    let params = new HttpParams();
    
    Object.keys(filters).forEach(key => {
      const value = (filters as any)[key];
      if (value !== undefined && value !== null) {
        params = params.set(key, value.toString());
      }
    });
    
    return this.http.get<PaginatedResponse<ActivityLog>>(this.apiUrl, { params });
  }

  getOne(id: string): Observable<ActivityLog> {
    return this.http.get<ActivityLog>(`${this.apiUrl}/${id}`);
  }

  getByEntity(entityType: string, entityId: string): Observable<ActivityLog[]> {
    return this.http.get<ActivityLog[]>(`${this.apiUrl}/entity/${entityType}/${entityId}`);
  }

  getStatsByUser(userId: string, days: number = 30): Observable<{ action: string; count: number }[]> {
    const params = new HttpParams().set('days', days.toString());
    return this.http.get<{ action: string; count: number }[]>(
      `${this.apiUrl}/stats/${userId}`,
      { params }
    );
  }
}
```

### src/app/services/production-order.service.ts

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
  ProductionOrder, 
  CreateProductionOrderDto,
  ProductionOrderFilters,
  ProductionOrderStatus 
} from '../models/production-order.model';
import { PaginatedResponse } from '../models/common.model';

@Injectable({
  providedIn: 'root'
})
export class ProductionOrderService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/production-orders`;

  getAll(filters: ProductionOrderFilters): Observable<PaginatedResponse<ProductionOrder>> {
    let params = new HttpParams();
    
    Object.keys(filters).forEach(key => {
      const value = (filters as any)[key];
      if (value !== undefined && value !== null) {
        params = params.set(key, value.toString());
      }
    });
    
    return this.http.get<PaginatedResponse<ProductionOrder>>(this.apiUrl, { params });
  }

  getOne(id: string): Observable<ProductionOrder> {
    return this.http.get<ProductionOrder>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateProductionOrderDto): Observable<ProductionOrder> {
    return this.http.post<ProductionOrder>(this.apiUrl, dto);
  }

  update(id: string, dto: Partial<CreateProductionOrderDto>): Observable<ProductionOrder> {
    return this.http.patch<ProductionOrder>(`${this.apiUrl}/${id}`, dto);
  }

  updateStatus(id: string, status: ProductionOrderStatus): Observable<ProductionOrder> {
    return this.http.patch<ProductionOrder>(`${this.apiUrl}/${id}/status`, { status });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

### src/app/services/machine.service.ts

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Machine, CreateMachineDto, MachineStatus } from '../models/machine.model';
import { PaginatedResponse } from '../models/common.model';

@Injectable({
  providedIn: 'root'
})
export class MachineService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/machines`;

  getAll(
    workCenterId?: string, 
    status?: MachineStatus,
    page: number = 1,
    limit: number = 20
  ): Observable<PaginatedResponse<Machine>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    if (workCenterId) params = params.set('workCenterId', workCenterId);
    if (status) params = params.set('status', status);
    
    return this.http.get<PaginatedResponse<Machine>>(this.apiUrl, { params });
  }

  getOne(id: string): Observable<Machine> {
    return this.http.get<Machine>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateMachineDto): Observable<Machine> {
    return this.http.post<Machine>(this.apiUrl, dto);
  }

  update(id: string, dto: Partial<CreateMachineDto>): Observable<Machine> {
    return this.http.patch<Machine>(`${this.apiUrl}/${id}`, dto);
  }

  updateStatus(id: string, status: MachineStatus): Observable<Machine> {
    return this.http.patch<Machine>(`${this.apiUrl}/${id}/status`, { status });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

---

## Interceptores

### src/app/interceptors/auth.interceptor.ts

```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
```

### src/app/interceptors/error.interceptor.ts

```typescript
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // No autorizado - redirigir al login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.navigate(['/login']);
      }

      // Puedes agregar notificaciones toast aqu\u00ed
      console.error('HTTP Error:', error);
      
      return throwError(() => error);
    })
  );
};
```

---

## Guards

### src/app/guards/auth.guard.ts

```typescript
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Guardar URL intentada para redirigir despu\u00e9s del login
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
```

---

## Ejemplos de Uso en Componentes

### Dashboard Component

```typescript
// src/app/components/dashboard/dashboard.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardKPIs, ProductionTrend } from '../../models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      @if (loading()) {
        <p>Cargando...</p>
      } @else if (error()) {
        <p>Error: {{ error() }}</p>
      } @else {
        <div class="kpis">
          <div class="kpi-card">
            <h3>\u00d3rdenes Activas</h3>
            <p>{{ kpis()?.production.activeOrders }}</p>
          </div>
          <div class="kpi-card">
            <h3>M\u00e1quinas Activas</h3>
            <p>{{ kpis()?.machines.active }} / {{ kpis()?.machines.total }}</p>
          </div>
          <!-- M\u00e1s KPIs... -->
        </div>

        <div class="trend-chart">
          <h3>Tendencia de Producci\u00f3n</h3>
          @for (trend of productionTrend(); track trend.date) {
            <div>{{ trend.date }}: {{ trend.produced }} / {{ trend.planned }}</div>
          }
        </div>
      }
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);

  kpis = signal<DashboardKPIs | null>(null);
  productionTrend = signal<ProductionTrend[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading.set(true);
    
    this.dashboardService.getKPIs().subscribe({
      next: (data) => {
        this.kpis.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });

    this.dashboardService.getProductionTrend(7).subscribe({
      next: (data) => this.productionTrend.set(data)
    });
  }
}
```

### Notifications Component

```typescript
// src/app/components/notifications/notifications.component.ts
import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotificationsService } from '../../services/notifications.service';
import { AuthService } from '../../services/auth.service';
import { Notification } from '../../models/notification.model';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notifications">
      <div class="header">
        <h2>Notificaciones</h2>
        <span class="badge">{{ unreadCount() }}</span>
        <button (click)="markAllAsRead()">Marcar todas como le\u00eddas</button>
      </div>

      @if (loading()) {
        <p>Cargando...</p>
      } @else {
        @for (notification of notifications(); track notification.id) {
          <div class="notification" 
               [class.unread]="!notification.isRead"
               (click)="markAsRead(notification)">
            <span class="type" [class]="notification.type">{{ notification.type }}</span>
            <div class="content">
              <h4>{{ notification.title }}</h4>
              <p>{{ notification.message }}</p>
              <small>{{ notification.createdAt | date:'short' }}</small>
            </div>
          </div>
        }
      }
    </div>
  `
})
export class NotificationsComponent implements OnInit, OnDestroy {
  private notificationsService = inject(NotificationsService);
  private authService = inject(AuthService);
  private pollingSubscription?: Subscription;

  notifications = signal<Notification[]>([]);
  unreadCount = this.notificationsService.unreadCount;
  loading = signal(false);

  ngOnInit() {
    this.loadNotifications();
    this.startPolling();
  }

  ngOnDestroy() {
    this.pollingSubscription?.unsubscribe();
  }

  loadNotifications() {
    const userId = this.authService.currentUser()?.id;
    if (!userId) return;

    this.loading.set(true);
    this.notificationsService.getNotifications(userId, false).subscribe({
      next: (response) => {
        this.notifications.set(response.data);
        this.loading.set(false);
      }
    });
  }

  markAsRead(notification: Notification) {
    if (notification.isRead) return;

    this.notificationsService.markAsRead(notification.id).subscribe({
      next: () => {
        this.loadNotifications();
      }
    });
  }

  markAllAsRead() {
    const userId = this.authService.currentUser()?.id;
    if (!userId) return;

    this.notificationsService.markAllAsRead(userId).subscribe({
      next: () => {
        this.loadNotifications();
      }
    });
  }

  startPolling() {
    const userId = this.authService.currentUser()?.id;
    if (!userId) return;

    this.pollingSubscription = this.notificationsService
      .startPollingUnreadCount(userId, 30000)
      .subscribe();
  }
}
```

---

## \ud83d\ude80 Resumen de Endpoints Disponibles

| M\u00f3dulo | Endpoint Base | Descripci\u00f3n |
|---------|---------------|--------------|
| **Auth** | `/auth` | Login, registro, autenticaci\u00f3n |
| **Dashboard** | `/dashboard` | KPIs, m\u00e9tricas, tendencias |
| **Notifications** | `/notifications` | Sistema de notificaciones |
| **Activity Log** | `/activity-log` | Registro de auditor\u00eda |
| **Production Orders** | `/production-orders` | Gesti\u00f3n de \u00f3rdenes |
| **Machines** | `/machines` | Cat\u00e1logo de m\u00e1quinas |
| **Products** | `/products` | Cat\u00e1logo de productos |
| **Work Centers** | `/work-centers` | Centros de trabajo |
| **Quality** | `/quality` | Control de calidad |
| **Traceability** | `/traceability` | Trazabilidad |
| **Reports** | `/reports` | Reportes y anal\u00edticas |

---

## \ud83d\udcdd Pr\u00f3ximos Pasos

1. **Copiar los modelos** a tu proyecto Angular
2. **Copiar los servicios** y adaptarlos seg\u00fan necesites
3. **Implementar los interceptores** para autenticaci\u00f3n y manejo de errores
4. **Crear los componentes** usando los ejemplos como referencia
5. **Probar la integraci\u00f3n** con el backend en `http://localhost:3000`

\u00bfNecesitas ayuda con alg\u00fan componente espec\u00edfico o funcionalidad adicional?
