# 🔗 Guía de Conexión: mes-frontend ↔ Backend MES

## 📋 Resumen
Esta guía te ayudará a conectar tu frontend Angular (`mes-frontend`) con el backend NestJS del sistema MES.

---

## ✅ Estado del Backend

### Configuración Actual
- **URL del Backend:** `http://localhost:3000`
- **Documentación API (Swagger):** `http://localhost:3000/api/docs`
- **CORS Configurado para:** 
  - `http://localhost:4200` ✅
  - `http://localhost:4201` ✅
  - `http://127.0.0.1:4200` ✅

### Características Habilitadas
- ✅ CORS habilitado con orígenes múltiples
- ✅ Validación global de DTOs
- ✅ Autenticación JWT (Bearer Token)
- ✅ Documentación Swagger
- ✅ Manejo de errores global

---

## 🚀 Pasos para Conectar el Frontend

### 1. Configurar el Environment en Angular

En tu proyecto `mes-frontend`, crea o actualiza el archivo de entorno:

**`src/environments/environment.ts`**
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  apiPrefix: '', // Opcional, si usas prefijo como '/api'
};
```

**`src/environments/environment.prod.ts`**
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://tu-servidor-produccion.com',
  apiPrefix: '',
};
```

---

### 2. Crear Interceptor para JWT

**`src/app/core/interceptors/auth.interceptor.ts`**
```typescript
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('access_token');
    
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    
    return next.handle(req);
  }
}
```

**Registrar en `app.config.ts` o `app.module.ts`:**
```typescript
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    // ... otros providers
  ]
};
```

---

### 3. Crear un Servicio Base (Opcional pero Recomendado)

**`src/app/core/services/base-api.service.ts`**
```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseApiService {
  protected http = inject(HttpClient);
  protected baseUrl = environment.apiUrl;

  protected getUrl(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }
}
```

---

### 4. Ejemplo de Servicio que Consume la API

**`src/app/features/production/services/production-order.service.ts`**
```typescript
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ProductionOrder, PaginatedResponse } from '../../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class ProductionOrderService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/production-orders`;

  // Signals para estado reactivo
  loading = signal(false);
  error = signal<string | null>(null);

  getAll(page = 1, limit = 20, filters?: any): Observable<PaginatedResponse<ProductionOrder>> {
    this.loading.set(true);
    this.error.set(null);

    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.search) params = params.set('search', filters.search);

    return this.http.get<PaginatedResponse<ProductionOrder>>(this.apiUrl, { params })
      .pipe(
        tap(() => this.loading.set(false)),
        catchError(error => {
          this.loading.set(false);
          this.error.set(error.message);
          return throwError(() => error);
        })
      );
  }

  getById(id: string): Observable<ProductionOrder> {
    return this.http.get<ProductionOrder>(`${this.apiUrl}/${id}`);
  }

  create(order: any): Observable<ProductionOrder> {
    return this.http.post<ProductionOrder>(this.apiUrl, order);
  }

  update(id: string, order: any): Observable<ProductionOrder> {
    return this.http.patch<ProductionOrder>(`${this.apiUrl}/${id}`, order);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  changeStatus(id: string, status: string): Observable<ProductionOrder> {
    return this.http.patch<ProductionOrder>(`${this.apiUrl}/${id}/status`, { status });
  }
}
```

---

### 5. Uso en Componentes

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { ProductionOrderService } from './services/production-order.service';

@Component({
  selector: 'app-production-orders',
  templateUrl: './production-orders.component.html',
})
export class ProductionOrdersComponent implements OnInit {
  private productionService = inject(ProductionOrderService);

  orders = signal<ProductionOrder[]>([]);
  loading = this.productionService.loading;
  error = this.productionService.error;

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.productionService.getAll(1, 20).subscribe({
      next: (response) => {
        this.orders.set(response.data);
      },
      error: (err) => {
        console.error('Error cargando órdenes:', err);
      }
    });
  }
}
```

---

## 🔐 Autenticación

### Login

**Request:**
```typescript
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "admin@mes.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-user",
    "email": "admin@mes.com",
    "name": "Administrador"
  }
}
```

**Guardar el token:**
```typescript
login(email: string, password: string) {
  return this.http.post<{access_token: string}>(`${this.apiUrl}/auth/login`, {
    email,
    password
  }).pipe(
    tap(response => {
      localStorage.setItem('access_token', response.access_token);
    })
  );
}
```

---

## 📚 Endpoints Principales Disponibles

### Autenticación
- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registrar usuario
- `GET /auth/profile` - Obtener perfil del usuario autenticado

### Dashboard
- `GET /dashboard/kpis` - Obtener KPIs principales
- `GET /dashboard/production-trends` - Tendencias de producción
- `GET /dashboard/quality-metrics` - Métricas de calidad

### Órdenes de Producción
- `GET /production-orders` - Listar órdenes (con filtros y paginación)
- `POST /production-orders` - Crear orden
- `GET /production-orders/:id` - Obtener orden por ID
- `PATCH /production-orders/:id` - Actualizar orden
- `DELETE /production-orders/:id` - Eliminar orden
- `PATCH /production-orders/:id/status` - Cambiar estado

### Datos Maestros
- `GET /master-data/products` - Productos
- `GET /master-data/materials` - Materiales
- `GET /master-data/machines` - Máquinas
- `GET /master-data/operators` - Operadores

### Calidad
- `GET /quality/inspections` - Inspecciones
- `GET /quality/defects` - Defectos
- `GET /quality/certificates` - Certificados

### Trazabilidad
- `GET /traceability/batches/:id` - Trazabilidad de lote
- `GET /traceability/full/:id` - Trazabilidad completa

### Notificaciones
- `GET /notifications` - Obtener notificaciones
- `PATCH /notifications/:id/read` - Marcar como leída

### Reportes
- `GET /reports/production` - Reporte de producción
- `GET /reports/quality` - Reporte de calidad
- `GET /reports/efficiency` - Reporte de eficiencia

---

## 🧪 Probar la Conexión

### 1. Iniciar el Backend
```bash
cd C:\Users\ASUS\Documents\DESARROLLO\BACKEND\mes
npm run start:dev
```

Deberías ver:
```
🚀 Servidor MES Backend iniciado
📍 API: http://localhost:3000
📚 Swagger: http://localhost:3000/api/docs
🔗 Frontend permitido: http://localhost:4200
```

### 2. Iniciar el Frontend
```bash
cd C:\Users\ASUS\Documents\DESARROLLO\FRONTEND\mes-frontend
ng serve
```

### 3. Probar desde el navegador
Abre `http://localhost:4200` y verifica que las peticiones al backend funcionen correctamente.

### 4. Verificar en las DevTools
- Abre las DevTools del navegador (F12)
- Ve a la pestaña **Network**
- Filtra por **XHR** o **Fetch**
- Verifica que las peticiones se hagan a `http://localhost:3000`
- Verifica que no haya errores CORS

---

## ⚠️ Problemas Comunes

### Error de CORS
**Síntoma:** `Access to XMLHttpRequest at 'http://localhost:3000/...' from origin 'http://localhost:4200' has been blocked by CORS policy`

**Solución:**
- Verifica que el backend esté corriendo
- Verifica que `http://localhost:4200` esté en la lista de orígenes permitidos en `main.ts`
- Limpia la caché del navegador

### Error 401 Unauthorized
**Síntoma:** Las peticiones devuelven 401

**Solución:**
- Verifica que hayas guardado el token: `localStorage.getItem('access_token')`
- Verifica que el interceptor esté registrado
- Verifica que el token no haya expirado

### Error de Conexión
**Síntoma:** `ERR_CONNECTION_REFUSED`

**Solución:**
- Verifica que el backend esté corriendo en el puerto 3000
- Ejecuta: `netstat -ano | findstr :3000` para ver si el puerto está en uso

---

## 📖 Documentación Adicional

- **Swagger API Docs:** http://localhost:3000/api/docs
- **Guía de Integración API:** Ver `API_INTEGRATION_GUIDE.md`
- **Guía de Servicios Angular:** Ver `ANGULAR_SERVICES_GUIDE.md`
- **Módulo de Producción:** Ver `FRONTEND_PRODUCTION_INTEGRATION.md`

---

## 🎯 Checklist de Integración

- [ ] Backend corriendo en `http://localhost:3000`
- [ ] CORS configurado correctamente
- [ ] Archivo `environment.ts` con `apiUrl` correcto
- [ ] Interceptor HTTP configurado para JWT
- [ ] Servicios creados para consumir la API
- [ ] Manejo de errores implementado
- [ ] Pruebas de conexión exitosas
- [ ] Token de autenticación funcionando

---

## 💡 Consejos

1. **Usa Swagger** para probar los endpoints antes de integrarlos
2. **Implementa manejo de errores** en todos los servicios
3. **Usa signals** para estado reactivo (Angular 16+)
4. **Tipado fuerte** con interfaces/models
5. **Lazy loading** para módulos grandes
6. **Interceptores** para funcionalidad común (auth, error handling, loading)

---

## 🆘 Soporte

Si tienes problemas con la integración:
1. Revisa los logs del backend en la terminal
2. Revisa la consola del navegador (DevTools)
3. Verifica la pestaña Network en DevTools
4. Consulta la documentación de Swagger

---

**Última actualización:** Diciembre 2025
