# Script para generar todos los módulos de Trazabilidad
# Ejecutar desde la raíz del proyecto: .\generate-traceability-modules.ps1

Write-Host "Generando módulos de Trazabilidad..." -ForegroundColor Green

# Generar cada módulo con NestJS CLI
$modules = @(
    "traceability/lots",
    "traceability/movements",
    "traceability/genealogy",
    "traceability/serials",
    "traceability/locations",
    "traceability/labels",
    "traceability/events"
)

foreach ($module in $modules) {
    Write-Host "Generando $module..." -ForegroundColor Yellow
    
    # Generar el resource (incluye module, service, controller, dto, entity)
    nest g resource $module --no-spec
    
    Write-Host "✓ $module generado" -ForegroundColor Green
}

# Generar el módulo agregador principal
Write-Host "Generando módulo principal de Trazabilidad..." -ForegroundColor Yellow
nest g module traceability
nest g service traceability --no-spec
nest g controller traceability --no-spec

Write-Host "`n✓ Todos los módulos generados exitosamente!" -ForegroundColor Green
Write-Host "Ahora debes:" -ForegroundColor Cyan
Write-Host "1. Copiar las entities desde TRACEABILITY_COMPLETE.md" -ForegroundColor White
Write-Host "2. Copiar los DTOs" -ForegroundColor White
Write-Host "3. Copiar los Services" -ForegroundColor White
Write-Host "4. Copiar los Controllers" -ForegroundColor White
Write-Host "5. Configurar los módulos en traceability.module.ts" -ForegroundColor White
