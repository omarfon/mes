# Script para verificar los datos en la base de datos
$baseUrl = "http://localhost:3000"

Write-Host "`n=== VERIFICACION DE DATOS EN BASE DE DATOS ===" -ForegroundColor Cyan

# Verificar cada módulo
$modulos = @(
    @{nombre="TURNOS"; endpoint="turnos"},
    @{nombre="UNIDADES DE MEDIDA"; endpoint="unidades-medida"},
    @{nombre="OPERADORES"; endpoint="operadores"},
    @{nombre="MOTIVOS DE PARADA"; endpoint="motivos-parada"},
    @{nombre="PROCESOS"; endpoint="procesos"}
)

foreach ($modulo in $modulos) {
    Write-Host "`n[$($modulo.nombre)]" -ForegroundColor Yellow
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/$($modulo.endpoint)" -Method Get
        Write-Host "  Total de registros: $($response.meta.total)" -ForegroundColor Green
        
        # Mostrar primeros registros
        $response.data | Select-Object -First 3 | ForEach-Object {
            $codigo = if ($_.codigo) { $_.codigo } else { "N/A" }
            $nombre = if ($_.nombre) { $_.nombre } else { "N/A" }
            Write-Host "  - [$codigo] $nombre" -ForegroundColor Gray
        }
    } catch {
        Write-Host "  ERROR al consultar datos" -ForegroundColor Red
        Write-Host "  $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n=== ENDPOINTS DISPONIBLES PARA FRONTEND ===" -ForegroundColor Cyan
Write-Host "`nGET    $baseUrl/turnos"
Write-Host "GET    $baseUrl/turnos/:id"
Write-Host "POST   $baseUrl/turnos"
Write-Host "PATCH  $baseUrl/turnos/:id"
Write-Host "DELETE $baseUrl/turnos/:id"

Write-Host "`nGET    $baseUrl/unidades-medida"
Write-Host "GET    $baseUrl/unidades-medida/:id"
Write-Host "GET    $baseUrl/unidades-medida/convertir/:valor" -ForegroundColor Magenta
Write-Host "POST   $baseUrl/unidades-medida"
Write-Host "PATCH  $baseUrl/unidades-medida/:id"
Write-Host "DELETE $baseUrl/unidades-medida/:id"

Write-Host "`nGET    $baseUrl/operadores"
Write-Host "GET    $baseUrl/operadores/:id"
Write-Host "GET    $baseUrl/operadores/turno/:turnoId" -ForegroundColor Magenta
Write-Host "POST   $baseUrl/operadores"
Write-Host "PATCH  $baseUrl/operadores/:id"
Write-Host "DELETE $baseUrl/operadores/:id"

Write-Host "`nGET    $baseUrl/motivos-parada"
Write-Host "GET    $baseUrl/motivos-parada/:id"
Write-Host "GET    $baseUrl/motivos-parada/estadisticas/por-categoria" -ForegroundColor Magenta
Write-Host "POST   $baseUrl/motivos-parada"
Write-Host "PATCH  $baseUrl/motivos-parada/:id"
Write-Host "DELETE $baseUrl/motivos-parada/:id"

Write-Host "`nGET    $baseUrl/procesos"
Write-Host "GET    $baseUrl/procesos/:id"
Write-Host "GET    $baseUrl/procesos/estadisticas/por-tipo" -ForegroundColor Magenta
Write-Host "POST   $baseUrl/procesos/:id/duplicar" -ForegroundColor Magenta
Write-Host "POST   $baseUrl/procesos"
Write-Host "PATCH  $baseUrl/procesos/:id"
Write-Host "DELETE $baseUrl/procesos/:id"

Write-Host "`n" -NoNewline
