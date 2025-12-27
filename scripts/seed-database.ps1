# Script para poblar la base de datos con datos de prueba
# Uso: .\seed-database.ps1

$baseUrl = "http://localhost:3000"
$headers = @{
    "Content-Type" = "application/json"
}

Write-Host "=== Iniciando población de base de datos ===" -ForegroundColor Cyan
Write-Host ""

# Función para hacer POST request
function Post-Data {
    param (
        [string]$endpoint,
        [object]$data,
        [string]$nombre
    )
    
    try {
        Write-Host "Creando: $nombre..." -NoNewline
        $body = $data | ConvertTo-Json -Depth 10
        $response = Invoke-RestMethod -Uri "$baseUrl/$endpoint" -Method Post -Headers $headers -Body $body
        Write-Host " ✓" -ForegroundColor Green
        return $response
    } catch {
        Write-Host " ✗" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Yellow
        return $null
    }
}

# 1. TURNOS
Write-Host "`n[1/5] TURNOS" -ForegroundColor Yellow
Write-Host "─────────────────────────────────────" -ForegroundColor Gray

$turnos = @(
    @{
        codigo = "T1"
        nombre = "Turno Mañana"
        horaInicio = "06:00"
        horaFin = "14:00"
        duracionHoras = 8
        descripcion = "Turno de mañana - Producción general"
        activo = $true
        diasSemana = @(1, 2, 3, 4, 5)
        color = "#3498db"
    },
    @{
        codigo = "T2"
        nombre = "Turno Tarde"
        horaInicio = "14:00"
        horaFin = "22:00"
        duracionHoras = 8
        descripcion = "Turno de tarde - Producción general"
        activo = $true
        diasSemana = @(1, 2, 3, 4, 5)
        color = "#e67e22"
    },
    @{
        codigo = "T3"
        nombre = "Turno Noche"
        horaInicio = "22:00"
        horaFin = "06:00"
        duracionHoras = 8
        descripcion = "Turno nocturno - Producción especial"
        activo = $true
        diasSemana = @(1, 2, 3, 4, 5)
        color = "#9b59b6"
    }
)

foreach ($turno in $turnos) {
    Post-Data -endpoint "turnos" -data $turno -nombre $turno.nombre
}

# 2. UNIDADES DE MEDIDA
Write-Host "`n[2/5] UNIDADES DE MEDIDA" -ForegroundColor Yellow
Write-Host "─────────────────────────────────────" -ForegroundColor Gray

$unidades = @(
    @{
        codigo = "KG"
        nombre = "Kilogramo"
        simbolo = "kg"
        tipo = "MASA"
        descripcion = "Unidad de masa del Sistema Internacional"
        factorConversion = 1
        esSI = $true
        activo = $true
        decimales = 3
    },
    @{
        codigo = "G"
        nombre = "Gramo"
        simbolo = "g"
        tipo = "MASA"
        descripcion = "Unidad de masa"
        factorConversion = 0.001
        esSI = $true
        activo = $true
        decimales = 2
    },
    @{
        codigo = "M"
        nombre = "Metro"
        simbolo = "m"
        tipo = "LONGITUD"
        descripcion = "Unidad de longitud del Sistema Internacional"
        factorConversion = 1
        esSI = $true
        activo = $true
        decimales = 3
    },
    @{
        codigo = "L"
        nombre = "Litro"
        simbolo = "l"
        tipo = "VOLUMEN"
        descripcion = "Unidad de volumen"
        factorConversion = 1
        esSI = $false
        activo = $true
        decimales = 2
    },
    @{
        codigo = "UND"
        nombre = "Unidad"
        simbolo = "un"
        tipo = "CANTIDAD"
        descripcion = "Unidad de cantidad - Pieza"
        factorConversion = 1
        esSI = $false
        activo = $true
        decimales = 0
    },
    @{
        codigo = "HR"
        nombre = "Hora"
        simbolo = "h"
        tipo = "TIEMPO"
        descripcion = "Unidad de tiempo"
        factorConversion = 3600
        esSI = $false
        activo = $true
        decimales = 2
    }
)

foreach ($unidad in $unidades) {
    Post-Data -endpoint "unidades-medida" -data $unidad -nombre $unidad.nombre
}

# 3. OPERADORES
Write-Host "`n[3/5] OPERADORES" -ForegroundColor Yellow
Write-Host "─────────────────────────────────────" -ForegroundColor Gray

$operadores = @(
    @{
        codigo = "OP001"
        numeroEmpleado = "EMP-2024-001"
        nombre = "Juan"
        apellidos = "García López"
        email = "juan.garcia@empresa.com"
        telefono = "+34 600 123 456"
        estado = "ACTIVO"
        nivelHabilidad = "AVANZADO"
        departamento = "Producción"
        puesto = "Operador de máquina CNC"
        fechaIngreso = "2022-01-15"
        certificaciones = @("ISO 9001", "Seguridad Industrial", "CNC Básico")
        habilidades = @("CNC", "Soldadura", "Control de calidad")
    },
    @{
        codigo = "OP002"
        numeroEmpleado = "EMP-2024-002"
        nombre = "María"
        apellidos = "Rodríguez Sánchez"
        email = "maria.rodriguez@empresa.com"
        telefono = "+34 600 234 567"
        estado = "ACTIVO"
        nivelHabilidad = "EXPERTO"
        departamento = "Producción"
        puesto = "Supervisora de línea"
        fechaIngreso = "2020-03-10"
        certificaciones = @("Liderazgo", "Six Sigma Green Belt", "ISO 9001")
        habilidades = @("Gestión de equipos", "Lean Manufacturing", "Resolución de problemas")
    },
    @{
        codigo = "OP003"
        numeroEmpleado = "EMP-2024-003"
        nombre = "Carlos"
        apellidos = "Martínez Pérez"
        email = "carlos.martinez@empresa.com"
        telefono = "+34 600 345 678"
        estado = "ACTIVO"
        nivelHabilidad = "INTERMEDIO"
        departamento = "Mantenimiento"
        puesto = "Técnico de mantenimiento"
        fechaIngreso = "2023-06-01"
        certificaciones = @("Electricidad industrial", "Mecánica básica")
        habilidades = @("Mantenimiento preventivo", "Diagnóstico de fallas", "Electricidad")
    },
    @{
        codigo = "OP004"
        numeroEmpleado = "EMP-2024-004"
        nombre = "Ana"
        apellidos = "Torres Gómez"
        email = "ana.torres@empresa.com"
        telefono = "+34 600 456 789"
        estado = "ACTIVO"
        nivelHabilidad = "BASICO"
        departamento = "Calidad"
        puesto = "Inspector de calidad"
        fechaIngreso = "2024-01-10"
        certificaciones = @("Metrología", "Control estadístico")
        habilidades = @("Inspección visual", "Uso de instrumentos de medición", "Documentación")
    }
)

foreach ($operador in $operadores) {
    $nombreCompleto = "$($operador.nombre) $($operador.apellidos)"
    Post-Data -endpoint "operadores" -data $operador -nombre $nombreCompleto
}

# 4. MOTIVOS DE PARADA
Write-Host "`n[4/5] MOTIVOS DE PARADA" -ForegroundColor Yellow
Write-Host "─────────────────────────────────────" -ForegroundColor Gray

$motivos = @(
    @{
        codigo = "MP001"
        nombre = "Falta de material"
        descripcion = "Parada por falta de materia prima o componentes"
        categoria = "MATERIALES"
        tipo = "MEDIA"
        requiereAprobacion = $false
        requiereComentario = $true
        requiereEvidencia = $false
        color = "#e74c3c"
        icono = "box"
        tiempoEstandardMinutos = 30
        prioridad = 2
        impactaOEE = $true
        departamentoResponsable = "Logística"
        accionesCorrectivas = @("Verificar stock", "Contactar proveedor", "Revisar planificación")
        activo = $true
    },
    @{
        codigo = "MP002"
        nombre = "Mantenimiento preventivo"
        descripcion = "Parada programada para mantenimiento preventivo"
        categoria = "PLANIFICADA"
        tipo = "LARGA"
        requiereAprobacion = $true
        requiereComentario = $true
        requiereEvidencia = $true
        color = "#3498db"
        icono = "wrench"
        tiempoEstandardMinutos = 120
        prioridad = 3
        impactaOEE = $false
        departamentoResponsable = "Mantenimiento"
        accionesCorrectivas = @("Seguir plan de mantenimiento", "Documentar actividades")
        activo = $true
    },
    @{
        codigo = "MP003"
        nombre = "Cambio de formato"
        descripcion = "Parada por cambio de formato o setup de máquina"
        categoria = "PRODUCCION"
        tipo = "MEDIA"
        requiereAprobacion = $false
        requiereComentario = $false
        requiereEvidencia = $false
        color = "#f39c12"
        icono = "gear"
        tiempoEstandardMinutos = 45
        prioridad = 3
        impactaOEE = $true
        departamentoResponsable = "Producción"
        accionesCorrectivas = @("Optimizar tiempo de setup", "SMED")
        activo = $true
    },
    @{
        codigo = "MP004"
        nombre = "Falla mecánica"
        descripcion = "Parada por falla mecánica no planificada"
        categoria = "NO_PLANIFICADA"
        tipo = "LARGA"
        requiereAprobacion = $false
        requiereComentario = $true
        requiereEvidencia = $true
        color = "#c0392b"
        icono = "warning"
        tiempoEstandardMinutos = 90
        prioridad = 1
        impactaOEE = $true
        departamentoResponsable = "Mantenimiento"
        accionesCorrectivas = @("Diagnosticar falla", "Reparar componente", "Analizar causa raíz")
        activo = $true
    },
    @{
        codigo = "MP005"
        nombre = "Defecto de calidad"
        descripcion = "Parada por detección de defectos de calidad"
        categoria = "CALIDAD"
        tipo = "CORTA"
        requiereAprobacion = $false
        requiereComentario = $true
        requiereEvidencia = $true
        color = "#e67e22"
        icono = "search"
        tiempoEstandardMinutos = 20
        prioridad = 1
        impactaOEE = $true
        departamentoResponsable = "Calidad"
        accionesCorrectivas = @("Revisar parámetros", "Ajustar proceso", "Verificar especificaciones")
        activo = $true
    },
    @{
        codigo = "MP006"
        nombre = "Falta de personal"
        descripcion = "Parada por ausencia de operadores"
        categoria = "PERSONAL"
        tipo = "MEDIA"
        requiereAprobacion = $false
        requiereComentario = $true
        requiereEvidencia = $false
        color = "#9b59b6"
        icono = "people"
        tiempoEstandardMinutos = 60
        prioridad = 2
        impactaOEE = $true
        departamentoResponsable = "Recursos Humanos"
        accionesCorrectivas = @("Buscar reemplazo", "Reorganizar turnos")
        activo = $true
    }
)

foreach ($motivo in $motivos) {
    Post-Data -endpoint "motivos-parada" -data $motivo -nombre $motivo.nombre
}

# 5. PROCESOS
Write-Host "`n[5/5] PROCESOS" -ForegroundColor Yellow
Write-Host "─────────────────────────────────────" -ForegroundColor Gray

$procesos = @(
    @{
        codigo = "PROC-001"
        nombre = "Corte de material"
        descripcion = "Proceso de corte de materia prima según especificaciones"
        tipo = "MANUFACTURA"
        estado = "ACTIVO"
        version = "1.0"
        tiempoEstandarMinutos = 15.5
        tiempoSetupMinutos = 10
        instrucciones = "1. Verificar dimensiones en plano`n2. Ajustar máquina`n3. Realizar corte`n4. Verificar medidas"
        requisitosCalidad = "Tolerancia ±0.5mm, sin rebabas"
        parametros = @{
            velocidad = "1500 rpm"
            avance = "100 mm/min"
            profundidad = "5 mm"
        }
        recursos = @("Sierra circular", "Calibrador", "Guantes de seguridad")
        habilidadesRequeridas = @("Lectura de planos", "Uso de máquinas de corte")
        secuencia = 1
        puntosCriticos = @("Verificación de medidas", "Control de rebabas")
        riesgos = @("Cortes", "Proyección de virutas")
        eficienciaEsperada = 85
        costoEstandar = 12.50
    },
    @{
        codigo = "PROC-002"
        nombre = "Mecanizado CNC"
        descripcion = "Proceso de mecanizado de precisión con control numérico"
        tipo = "MANUFACTURA"
        estado = "ACTIVO"
        version = "2.1"
        tiempoEstandarMinutos = 45
        tiempoSetupMinutos = 30
        instrucciones = "1. Cargar programa CNC`n2. Montar pieza en fixture`n3. Verificar cero pieza`n4. Ejecutar programa`n5. Inspeccionar"
        requisitosCalidad = "Tolerancia ±0.01mm, Ra 1.6"
        parametros = @{
            velocidadHusillo = "3000 rpm"
            avance = "200 mm/min"
            refrigerante = "Soluble 5%"
        }
        recursos = @("Centro de mecanizado CNC", "Herramientas de corte", "Micrómetro", "Rugosímetro")
        habilidadesRequeridas = @("Programación CNC", "Metrología", "Control numérico")
        secuencia = 2
        puntosCriticos = @("Cero pieza", "Primera pieza", "Control dimensional")
        riesgos = @("Rotura de herramienta", "Colisión de husillo")
        eficienciaEsperada = 92
        costoEstandar = 85.00
    },
    @{
        codigo = "PROC-003"
        nombre = "Ensamble de subconjunto"
        descripcion = "Proceso de ensamble de componentes en subconjunto"
        tipo = "ENSAMBLE"
        estado = "ACTIVO"
        version = "1.5"
        tiempoEstandarMinutos = 25
        tiempoSetupMinutos = 5
        instrucciones = "1. Verificar componentes`n2. Limpiar superficies`n3. Aplicar adhesivo`n4. Ensamblar componentes`n5. Verificar ajuste"
        requisitosCalidad = "Sin juego, torque según especificación"
        parametros = @{
            torque = "25 Nm"
            adhesivo = "Loctite 243"
        }
        recursos = @("Torquímetro", "Adhesivo", "Estación de ensamble")
        habilidadesRequeridas = @("Ensamble de precisión", "Uso de torquímetro")
        secuencia = 3
        puntosCriticos = @("Limpieza de superficies", "Aplicación de torque correcto")
        riesgos = @("Daño de roscas", "Contaminación")
        eficienciaEsperada = 88
        costoEstandar = 18.75
    },
    @{
        codigo = "PROC-004"
        nombre = "Inspección dimensional"
        descripcion = "Proceso de inspección y control dimensional"
        tipo = "INSPECCION"
        estado = "ACTIVO"
        version = "1.0"
        tiempoEstandarMinutos = 10
        tiempoSetupMinutos = 2
        instrucciones = "1. Revisar plan de control`n2. Medir dimensiones críticas`n3. Registrar mediciones`n4. Validar tolerancias`n5. Aprobar/Rechazar"
        requisitosCalidad = "100% de dimensiones dentro de tolerancia"
        parametros = @{
            muestreo = "n=5 cada 2 horas"
        }
        recursos = @("Calibrador digital", "Micrómetro", "Hoja de inspección")
        habilidadesRequeridas = @("Metrología", "Interpretación de planos", "SPC")
        secuencia = 4
        puntosCriticos = @("Calibración de instrumentos", "Registro de datos")
        riesgos = @("Error de medición", "Falso positivo")
        eficienciaEsperada = 95
        costoEstandar = 8.50
    },
    @{
        codigo = "PROC-005"
        nombre = "Empaque final"
        descripcion = "Proceso de empaque y preparación para envío"
        tipo = "EMPAQUE"
        estado = "ACTIVO"
        version = "1.0"
        tiempoEstandarMinutos = 8
        tiempoSetupMinutos = 3
        instrucciones = "1. Verificar producto`n2. Colocar en empaque primario`n3. Etiquetar`n4. Colocar en caja`n5. Sellar"
        requisitosCalidad = "Producto protegido, etiquetado correcto"
        recursos = @("Cajas", "Etiquetas", "Selladora", "Material de relleno")
        habilidadesRequeridas = @("Empaque básico")
        secuencia = 5
        puntosCriticos = @("Etiquetado correcto", "Sellado hermético")
        riesgos = @("Daño de producto", "Etiquetado incorrecto")
        eficienciaEsperada = 90
        costoEstandar = 5.25
    }
)

foreach ($proceso in $procesos) {
    Post-Data -endpoint "procesos" -data $proceso -nombre $proceso.nombre
}

Write-Host "`n=== Población de base de datos completada ===" -ForegroundColor Cyan
Write-Host ""
