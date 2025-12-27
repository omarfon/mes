# 🔧 Configuración Rápida - Frontend

## Para conectar `mes-frontend` con este backend:

### 1️⃣ En `mes-frontend/src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};
```

### 2️⃣ Crear interceptor HTTP en `mes-frontend/src/app/core/interceptors/auth.interceptor.ts`:
```typescript
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access_token');
  
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
  
  return next(req);
};
```

### 3️⃣ Registrar en `app.config.ts`:
```typescript
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
  ]
};
```

### 4️⃣ Ejemplo de servicio:
```typescript
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export class MiServicio {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/mi-endpoint`;
  
  getAll() {
    return this.http.get(this.apiUrl);
  }
}
```

## ✅ El backend ya está configurado con:
- ✅ CORS habilitado para `http://localhost:4200`
- ✅ JWT autenticación  
- ✅ Documentación Swagger en: http://localhost:3000/api/docs
- ✅ Validación de DTOs
- ✅ Servidor corriendo en puerto 3000

## 📖 Documentación completa:
Ver [FRONTEND_CONNECTION_GUIDE.md](./FRONTEND_CONNECTION_GUIDE.md)
