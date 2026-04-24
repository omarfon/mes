# Script para crear las tablas del motor de reglas y cargar reglas predefinidas

Write-Host "=== Configurando Motor de Reglas ===" -ForegroundColor Cyan

# Paso 1: Crear tablas
Write-Host "`n1. Creando tablas del motor de reglas..." -ForegroundColor Yellow
Get-Content create-rules-engine-tables.sql | docker exec -i mes_postgres psql -U mes_user -d mes_db

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Tablas creadas exitosamente" -ForegroundColor Green
} else {
    Write-Host "   ✗ Error creando tablas" -ForegroundColor Red
    exit 1
}

# Paso 2: Verificar que las tablas existen
Write-Host "`n2. Verificando tablas..." -ForegroundColor Yellow
$tables = docker exec -i mes_postgres psql -U mes_user -d mes_db -c "\dt rules*"
Write-Host $tables

# Paso 3: Información sobre carga de reglas predefinidas
Write-Host "`n3. Carga de reglas predefinidas" -ForegroundColor Yellow
Write-Host "   Las reglas predefinidas están disponibles en el código fuente." -ForegroundColor Cyan
Write-Host "   Para cargarlas, puedes usar cualquiera de estos métodos:" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Opción A - Desde la API REST:" -ForegroundColor White
Write-Host "   POST http://localhost:3000/api/rules-engine" -ForegroundColor Gray
Write-Host "   Body: Ver ejemplos en src/rules-engine/predefined-rules.ts" -ForegroundColor Gray
Write-Host ""
Write-Host "   Opción B - Desde código TypeScript:" -ForegroundColor White
Write-Host "   Crear un seed script que importe predefinedRules y los inserte" -ForegroundColor Gray
Write-Host ""
Write-Host "   Opción C - Manualmente con curl/Postman:" -ForegroundColor White
Write-Host "   Usar las definiciones de predefined-rules.ts" -ForegroundColor Gray

# Paso 4: Mostrar estadísticas
Write-Host "`n4. Estadisticas actuales" -ForegroundColor Yellow
$ruleCount = docker exec -i mes_postgres psql -U mes_user -d mes_db -t -c "SELECT COUNT(*) FROM rules;"
Write-Host "   Reglas configuradas: $ruleCount" -ForegroundColor Cyan

# Paso 5: Endpoints disponibles
Write-Host "`n5. Endpoints disponibles" -ForegroundColor Yellow
Write-Host "   GET    /api/rules-engine                  - Listar reglas" -ForegroundColor Gray
Write-Host "   POST   /api/rules-engine                  - Crear regla" -ForegroundColor Gray
Write-Host "   GET    /api/rules-engine/:id              - Obtener regla" -ForegroundColor Gray
Write-Host "   PUT    /api/rules-engine/:id              - Actualizar regla" -ForegroundColor Gray
Write-Host "   DELETE /api/rules-engine/:id              - Eliminar regla" -ForegroundColor Gray
Write-Host "   PUT    /api/rules-engine/:id/toggle       - Habilitar/Deshabilitar" -ForegroundColor Gray
Write-Host "   POST   /api/rules-engine/trigger          - Disparar evento" -ForegroundColor Gray
Write-Host "   POST   /api/rules-engine/:id/execute      - Ejecutar regla manualmente" -ForegroundColor Gray
Write-Host "   GET    /api/rules-engine/:id/stats        - Estadísticas de regla" -ForegroundColor Gray
Write-Host "   GET    /api/rules-engine/executions/history - Historial" -ForegroundColor Gray

Write-Host "`n=== Motor de Reglas configurado ===" -ForegroundColor Green
Write-Host "El backend está listo para usar el motor de reglas." -ForegroundColor Cyan
Write-Host "Consulta src/rules-engine/predefined-rules.ts para ejemplos de reglas." -ForegroundColor Cyan
