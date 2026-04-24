# =====================================================
# Script PowerShell para ejecutar seed de master data
# Usa Docker para ejecutar SQL en PostgreSQL
# =====================================================

Write-Host "Iniciando seed de Master Data..." -ForegroundColor Cyan

# Configuracion de la base de datos
$DB_NAME = "mes_db"
$DB_USER = "mes_user"
$CONTAINER_NAME = "mes-postgres"

# Archivo SQL a ejecutar
$SQL_FILE = Join-Path $PSScriptRoot "seed-master-data.sql"

# Verificar que el archivo SQL existe
if (-not (Test-Path $SQL_FILE)) {
    Write-Host "ERROR: No se encuentra el archivo $SQL_FILE" -ForegroundColor Red
    exit 1
}

Write-Host "Archivo SQL: $SQL_FILE" -ForegroundColor Gray

# Verificar que Docker está corriendo
try {
    $null = docker ps 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Docker no esta corriendo" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "ERROR: Docker no esta disponible" -ForegroundColor Red
    exit 1
}

# Verificar que el contenedor existe
$containerExists = docker ps -a --filter "name=$CONTAINER_NAME" --format "{{.Names}}" 2>&1
if ($containerExists -ne $CONTAINER_NAME) {
    Write-Host "ERROR: Contenedor $CONTAINER_NAME no encontrado" -ForegroundColor Red
    Write-Host "Asegurate de que docker-compose esta corriendo" -ForegroundColor Yellow
    exit 1
}

try {
    Write-Host "Ejecutando seed en la base de datos $DB_NAME..." -ForegroundColor Yellow
    
    # Copiar el archivo SQL al contenedor
    docker cp $SQL_FILE ${CONTAINER_NAME}:/tmp/seed-master-data.sql
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: No se pudo copiar el archivo SQL al contenedor" -ForegroundColor Red
        exit 1
    }
    
    # Ejecutar el script SQL en el contenedor
    $output = docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -f /tmp/seed-master-data.sql 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Seed completado exitosamente!" -ForegroundColor Green
        Write-Host "" 
        Write-Host "Resultados:" -ForegroundColor Cyan
        $output | Select-String -Pattern ".*:.*" | ForEach-Object { 
            Write-Host "   $_" -ForegroundColor White 
        }
        
        # Limpiar el archivo temporal del contenedor
        docker exec $CONTAINER_NAME rm /tmp/seed-master-data.sql 2>&1 | Out-Null
    } else {
        Write-Host "Error al ejecutar el seed" -ForegroundColor Red
        Write-Host $output -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Proceso completado" -ForegroundColor Green
