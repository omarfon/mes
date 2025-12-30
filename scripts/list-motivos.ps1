# Listar motivos de parada disponibles
$baseUrl = "http://localhost:3000/api"

Write-Host "`n=== MOTIVOS DE PARADA DISPONIBLES ===" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/motivos-parada" -Method Get
    
    Write-Host "`nTotal: $($response.meta.total)" -ForegroundColor Green
    
    if ($response.data.Count -gt 0) {
        $response.data | ForEach-Object {
            Write-Host "`nID: $($_.id)" -ForegroundColor Gray
            Write-Host "Codigo: $($_.codigo)" -ForegroundColor White
            Write-Host "Nombre: $($_.nombre)" -ForegroundColor Cyan
            Write-Host "Categoria: $($_.categoria)" -ForegroundColor Yellow
            Write-Host "Activo: $($_.activo)" -ForegroundColor $(if ($_.activo) { "Green" } else { "Red" })
            Write-Host "---" -ForegroundColor DarkGray
        }
    } else {
        Write-Host "`nNo hay motivos de parada. Usa el archivo scripts/seed-motivos-parada.http" -ForegroundColor Yellow
    }
} catch {
    Write-Host "`nError: $($_.Exception.Message)" -ForegroundColor Red
}
