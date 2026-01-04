# 🔍 TRAZABILIDAD - TODOS LOS ARCHIVOS

Este documento contiene TODOS los archivos necesarios para los módulos de trazabilidad.
Copia cada archivo a su ubicación correspondiente.

---

## 📁 ESTRUCTURA DE CARPETAS

```
src/traceability/
├── lots/
│   ├── dto/
│   │   ├── create-lot.dto.ts
│   │   ├── update-lot.dto.ts
│   │   ├── update-lot-status.dto.ts
│   │   ├── block-lot.dto.ts
│   │   └── quarantine-lot.dto.ts
│   ├── entities/
│   │   └── lot.entity.ts
│   ├── lots.controller.ts
│   ├── lots.service.ts
│   └── lots.module.ts
├── movements/
│   ├── dto/
│   │   └── create-lot-movement.dto.ts
│   ├── entities/
│   │   └── lot-movement.entity.ts
│   ├── movements.controller.ts
│   ├── movements.service.ts
│   └── movements.module.ts
├── genealogy/
│   ├── dto/
│   │   └── create-genealogy.dto.ts
│   ├── entities/
│   │   └── genealogy.entity.ts
│   ├── genealogy.controller.ts
│   ├── genealogy.service.ts
│   └── genealogy.module.ts
├── serials/
│   ├── dto/
│   │   ├── create-serial.dto.ts
│   │   └── update-serial.dto.ts
│   ├── entities/
│   │   └── serial-unit.entity.ts
│   ├── serials.controller.ts
│   ├── serials.service.ts
│   └── serials.module.ts
├── locations/
│   ├── dto/
│   │   ├── create-location.dto.ts
│   │   └── update-location.dto.ts
│   ├── entities/
│   │   └── location.entity.ts
│   ├── locations.controller.ts
│   ├── locations.service.ts
│   └── locations.module.ts
├── labels/
│   ├── dto/
│   │   ├── create-label-template.dto.ts
│   │   └── print-label.dto.ts
│   ├── entities/
│   │   ├── label-template.entity.ts
│   │   └── label-print-history.entity.ts
│   ├── labels.controller.ts
│   ├── labels.service.ts
│   └── labels.module.ts
├── events/
│   ├── dto/
│   │   └── create-event.dto.ts
│   ├── entities/
│   │   └── traceability-event.entity.ts
│   ├── events.controller.ts
│   ├── events.service.ts
│   └── events.module.ts
├── traceability.controller.ts
├── traceability.service.ts
└── traceability.module.ts
```

---

## 🎯 COMANDOS PARA CREAR LA ESTRUCTURA

```powershell
# Ejecutar desde src/traceability/
nest g module lots
nest g service lots --no-spec
nest g controller lots --no-spec

nest g module movements
nest g service movements --no-spec
nest g controller movements --no-spec

nest g module genealogy
nest g service genealogy --no-spec
nest g controller genealogy --no-spec

nest g module serials
nest g service serials --no-spec
nest g controller serials --no-spec

nest g module locations
nest g service locations --no-spec
nest g controller locations --no-spec

nest g module labels
nest g service labels --no-spec
nest g controller labels --no-spec

nest g module events
nest g service events --no-spec
nest g controller events --no-spec

nest g module traceability
nest g service traceability --no-spec
nest g controller traceability --no-spec
```

---

## ✅ LISTA DE ARCHIVOS A CREAR

Usa el documento `TRACEABILITY_COMPLETE.md` para copiar el contenido de cada archivo.

### Lots Module (7 archivos)
- [ ] `src/traceability/lots/entities/lot.entity.ts`
- [ ] `src/traceability/lots/dto/create-lot.dto.ts`
- [ ] `src/traceability/lots/dto/update-lot.dto.ts`
- [ ] `src/traceability/lots/dto/update-lot-status.dto.ts`
- [ ] `src/traceability/lots/dto/block-lot.dto.ts`
- [ ] `src/traceability/lots/dto/quarantine-lot.dto.ts`
- [ ] `src/traceability/lots/lots.service.ts`
- [ ] `src/traceability/lots/lots.controller.ts`
- [ ] `src/traceability/lots/lots.module.ts`

### Movements Module (4 archivos)
- [ ] `src/traceability/movements/entities/lot-movement.entity.ts`
- [ ] `src/traceability/movements/dto/create-lot-movement.dto.ts`
- [ ] `src/traceability/movements/movements.service.ts`
- [ ] `src/traceability/movements/movements.controller.ts`
- [ ] `src/traceability/movements/movements.module.ts`

### Genealogy Module (4 archivos)
- [ ] `src/traceability/genealogy/entities/genealogy.entity.ts`
- [ ] `src/traceability/genealogy/dto/create-genealogy.dto.ts`
- [ ] `src/traceability/genealogy/genealogy.service.ts`
- [ ] `src/traceability/genealogy/genealogy.controller.ts`
- [ ] `src/traceability/genealogy/genealogy.module.ts`

### Serials Module (5 archivos)
- [ ] `src/traceability/serials/entities/serial-unit.entity.ts`
- [ ] `src/traceability/serials/dto/create-serial.dto.ts`
- [ ] `src/traceability/serials/dto/update-serial.dto.ts`
- [ ] `src/traceability/serials/serials.service.ts`
- [ ] `src/traceability/serials/serials.controller.ts`
- [ ] `src/traceability/serials/serials.module.ts`

### Locations Module (5 archivos)
- [ ] `src/traceability/locations/entities/location.entity.ts`
- [ ] `src/traceability/locations/dto/create-location.dto.ts`
- [ ] `src/traceability/locations/dto/update-location.dto.ts`
- [ ] `src/traceability/locations/locations.service.ts`
- [ ] `src/traceability/locations/locations.controller.ts`
- [ ] `src/traceability/locations/locations.module.ts`

### Labels Module (6 archivos)
- [ ] `src/traceability/labels/entities/label-template.entity.ts`
- [ ] `src/traceability/labels/entities/label-print-history.entity.ts`
- [ ] `src/traceability/labels/dto/create-label-template.dto.ts`
- [ ] `src/traceability/labels/dto/print-label.dto.ts`
- [ ] `src/traceability/labels/labels.service.ts`
- [ ] `src/traceability/labels/labels.controller.ts`
- [ ] `src/traceability/labels/labels.module.ts`

### Events Module (4 archivos)
- [ ] `src/traceability/events/entities/traceability-event.entity.ts`
- [ ] `src/traceability/events/dto/create-event.dto.ts`
- [ ] `src/traceability/events/events.service.ts`
- [ ] `src/traceability/events/events.controller.ts`
- [ ] `src/traceability/events/events.module.ts`

### Main Traceability Module (3 archivos)
- [ ] `src/traceability/traceability.service.ts`
- [ ] `src/traceability/traceability.controller.ts`
- [ ] `src/traceability/traceability.module.ts`

---

## 📝 PASOS PARA IMPLEMENTAR

1. **Genera los módulos con NestJS CLI**:
   - Ejecuta los comandos listados arriba
   - O ejecuta: `.\generate-traceability-modules.ps1`

2. **Copia las entities**:
   - Abre `TRACEABILITY_COMPLETE.md`
   - Copia cada entity a su archivo correspondiente

3. **Copia los DTOs**:
   - Están todos en `TRACEABILITY_COMPLETE.md`
   - Copia a los archivos dto/

4. **Copia los Services**:
   - Implementaciones completas en `TRACEABILITY_COMPLETE.md`

5. **Copia los Controllers**:
   - Endpoints completos en `TRACEABILITY_COMPLETE.md`

6. **Configura los Modules**:
   - Importa entities en cada módulo
   - Exporta services necesarios
   - Configura el módulo principal

7. **Actualiza AppModule**:
   ```typescript
   import { TraceabilityModule } from './traceability/traceability.module';
   
   @Module({
     imports: [
       // ... otros módulos
       TraceabilityModule,
     ],
   })
   export class AppModule {}
   ```

8. **Genera y ejecuta migraciones**:
   ```bash
   npm run migration:generate -- src/database/migrations/CreateTraceabilityTables
   npm run migration:run
   ```

---

## 🚀 VERIFICACIÓN

Después de copiar todos los archivos, verifica:

```bash
# Ver estructura creada
tree src/traceability /F

# Compilar
npm run build

# Ver rutas de Swagger
npm run start:dev
# Abre http://localhost:3000/api/docs
```

---

## 📡 ENDPOINTS DISPONIBLES

Después de implementar todo, tendrás estos endpoints:

### Lots
- POST /traceability/lots
- GET /traceability/lots
- GET /traceability/lots/:id
- PATCH /traceability/lots/:id
- PATCH /traceability/lots/:id/status
- PATCH /traceability/lots/:id/block
- PATCH /traceability/lots/:id/quarantine

### Movements
- POST /traceability/movements
- GET /traceability/movements/lot/:lotId
- GET /traceability/movements/location/:locationId

### Genealogy
- POST /traceability/genealogy/link
- GET /traceability/genealogy/parents/:lotId
- GET /traceability/genealogy/children/:lotId
- GET /traceability/genealogy/tree/:lotId
- GET /traceability/genealogy/upstream/:lotId
- GET /traceability/genealogy/downstream/:lotId

### Serials
- POST /traceability/serials
- GET /traceability/serials/lot/:lotId
- GET /traceability/serials/:serialNumber

### Locations
- POST /traceability/locations
- GET /traceability/locations
- GET /traceability/locations/:id
- GET /traceability/locations/map

### Labels
- POST /traceability/labels/templates
- POST /traceability/labels/print
- GET /traceability/labels/history/:entityId

### Events
- POST /traceability/events
- GET /traceability/events/lot/:lotId
- GET /traceability/events/entity/:entityId

### Traceability (Agregador Principal)
- GET /traceability/lot/:lotId/complete ⭐
- GET /traceability/serial/:serialNumber
- GET /traceability/search

---

## 💡 NOTA IMPORTANTE

Todos los archivos están COMPLETOS en `TRACEABILITY_COMPLETE.md`. 
Simplemente:
1. Crea la estructura de carpetas
2. Genera los módulos con NestJS CLI
3. Copia el contenido de cada archivo desde el .md

¡Listo! Sistema de trazabilidad completo funcionando.
