# 🚀 Setup Completo - Módulo de Trazabilidad

## ✅ Estado Actual
- ✅ Carpetas creadas
- ✅ lot.entity.ts creado
- ✅ create-lot.dto.ts creado
- ✅ update-lot.dto.ts creado

## 📝 Archivos Restantes por Crear

He dejado todo el código completo en `TRACEABILITY_COMPLETE.md`. 

### Proceso Rápido (Recomendado):

1. **Abre** `TRACEABILITY_COMPLETE.md`
2. **Busca** cada sección (Ctrl+F)
3. **Copia** el código directamente a los archivos

### Archivos Críticos a Crear Primero:

#### Lots Module (Prioritario)
```bash
# Ya creados:
✅ src/traceability/lots/entities/lot.entity.ts
✅ src/traceability/lots/dto/create-lot.dto.ts
✅ src/traceability/lots/dto/update-lot.dto.ts

# Crear estos:
□ src/traceability/lots/dto/update-lot-status.dto.ts
□ src/traceability/lots/dto/block-lot.dto.ts
□ src/traceability/lots/dto/quarantine-lot.dto.ts
□ src/traceability/lots/lots.service.ts
□ src/traceability/lots/lots.controller.ts
□ src/traceability/lots/lots.module.ts
```

## 🎯 Atajos Rápidos

### update-lot-status.dto.ts
```typescript
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { LotStatus } from '../entities/lot.entity';

export class UpdateLotStatusDto {
  @IsEnum(LotStatus)
  @IsNotEmpty()
  status: LotStatus;

  @IsString()
  @IsOptional()
  reason?: string;
}
```

### block-lot.dto.ts
```typescript
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class BlockLotDto {
  @IsBoolean()
  @IsNotEmpty()
  isBlocked: boolean;

  @IsString()
  @IsNotEmpty()
  reason: string;
}
```

### quarantine-lot.dto.ts
```typescript
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class QuarantineLotDto {
  @IsBoolean()
  @IsNotEmpty()
  isInQuarantine: boolean;

  @IsString()
  @IsNotEmpty()
  reason: string;
}
```

### lots.module.ts
```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LotsService } from './lots.service';
import { LotsController } from './lots.controller';
import { Lot } from './entities/lot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lot])],
  controllers: [LotsController],
  providers: [LotsService],
  exports: [LotsService],
})
export class LotsModule {}
```

## 🔥 Comandos Rápidos NestJS CLI

Ejecuta estos para generar la estructura básica de cada módulo:

```bash
cd src/traceability

# Lots (ya en progreso)
nest g module lots
nest g service lots --no-spec
nest g controller lots --no-spec

# Movements
nest g module movements
nest g service movements --no-spec
nest g controller movements --no-spec

# Genealogy
nest g module genealogy
nest g service genealogy --no-spec
nest g controller genealogy --no-spec

# Serials
nest g module serials
nest g service serials --no-spec
nest g controller serials --no-spec

# Locations
nest g module locations
nest g service locations --no-spec
nest g controller locations --no-spec

# Labels
nest g module labels
nest g service labels --no-spec
nest g controller labels --no-spec

# Events
nest g module events
nest g service events --no-spec
nest g controller events --no-spec

# Main Traceability
cd ..
nest g module traceability
nest g service traceability --no-spec
nest g controller traceability --no-spec
```

## 📚 Referencia Completa

TODO el código está en: **`TRACEABILITY_COMPLETE.md`**

Busca por:
- "## 1️⃣ Lots Module" para Lots
- "## 2️⃣ Lot Movements Module" para Movements
- "## 3️⃣ Genealogy Module" para Genealogy
- etc.

Cada sección tiene:
- ✅ Entity completa
- ✅ DTOs completos
- ✅ Service completo
- ✅ Controller completo
- ✅ Module configuration

## ⚡ Próximos Pasos

1. Ejecuta los comandos NestJS CLI arriba
2. Copia el código de `TRACEABILITY_COMPLETE.md` a cada archivo
3. Actualiza `src/app.module.ts`:
   ```typescript
   import { TraceabilityModule } from './traceability/traceability.module';
   
   @Module({
     imports: [
       // ... otros
       TraceabilityModule,
     ],
   })
   ```
4. Genera migraciones:
   ```bash
   npm run migration:generate -- src/database/migrations/CreateTraceabilityTables
   npm run migration:run
   ```

¿Necesitas que continúe creando más archivos manualmente o prefieres usar el documento completo?
