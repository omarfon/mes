# Verificar máquinas disponibles
$baseUrl = "http://localhost:3000"

Write-Host "`n=== MAQUINAS DISPONIBLES ===" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/machines" -Method Get
    
    Write-Host "`nTotal de maquinas: $($response.total)" -ForegroundColor Green
    
    if ($response.data.Count -gt 0) {
        Write-Host "`nMaquinas activas:" -ForegroundColor Yellow
        $response.data | ForEach-Object {
            Write-Host "  ID: $($_.id)" -ForegroundColor Gray
            Write-Host "  Codigo: $($_.code)" -ForegroundColor White
            Write-Host "  Nombre: $($_.name)" -ForegroundColor White
            Write-Host "  Estado: $($_.status)" -ForegroundColor Cyan
            Write-Host "  ---" -ForegroundColor DarkGray
        }
    } else {
        Write-Host "`nNo hay maquinas disponibles. Crea una nueva:" -ForegroundColor Yellow
        Write-Host @'
POST http://localhost:3000/machines
Content-Type: application/json

{
   "name":"Maquina de Prueba",
   "code":"TEST01",
   "description":"Maquina para pruebas",
   "status":"ACTIVE"
}
'@
    }
} catch {
    Write-Host "`nError al consultar maquinas: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
