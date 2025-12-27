# Script para poblar la base de datos con datos de prueba
$baseUrl = "http://localhost:3000"

Write-Host "=== Iniciando poblacion de base de datos ===" -ForegroundColor Cyan

# Turnos
Write-Host "`n[1/5] TURNOS" -ForegroundColor Yellow
$turnos = @'
[
  {"codigo":"T1","nombre":"Turno Manana","horaInicio":"06:00","horaFin":"14:00","duracionHoras":8,"descripcion":"Turno de manana - Produccion general","activo":true,"diasSemana":[1,2,3,4,5],"color":"#3498db"},
  {"codigo":"T2","nombre":"Turno Tarde","horaInicio":"14:00","horaFin":"22:00","duracionHoras":8,"descripcion":"Turno de tarde - Produccion general","activo":true,"diasSemana":[1,2,3,4,5],"color":"#e67e22"},
  {"codigo":"T3","nombre":"Turno Noche","horaInicio":"22:00","horaFin":"06:00","duracionHoras":8,"descripcion":"Turno nocturno - Produccion especial","activo":true,"diasSemana":[1,2,3,4,5],"color":"#9b59b6"}
]
'@

$turnosArray = $turnos | ConvertFrom-Json
foreach ($t in $turnosArray) {
    try {
        Write-Host "  Creando: $($t.nombre)..." -NoNewline
        $body = $t | ConvertTo-Json
        Invoke-RestMethod -Uri "$baseUrl/turnos" -Method Post -ContentType "application/json" -Body $body | Out-Null
        Write-Host " OK" -ForegroundColor Green
    } catch {
        Write-Host " ERROR" -ForegroundColor Red
    }
}

# Unidades de Medida
Write-Host "`n[2/5] UNIDADES DE MEDIDA" -ForegroundColor Yellow
$unidades = @'
[
  {"codigo":"KG","nombre":"Kilogramo","simbolo":"kg","tipo":"MASA","descripcion":"Unidad de masa del Sistema Internacional","factorConversion":1,"esSI":true,"activo":true,"decimales":3},
  {"codigo":"G","nombre":"Gramo","simbolo":"g","tipo":"MASA","descripcion":"Unidad de masa","factorConversion":0.001,"esSI":true,"activo":true,"decimales":2},
  {"codigo":"M","nombre":"Metro","simbolo":"m","tipo":"LONGITUD","descripcion":"Unidad de longitud del Sistema Internacional","factorConversion":1,"esSI":true,"activo":true,"decimales":3},
  {"codigo":"L","nombre":"Litro","simbolo":"l","tipo":"VOLUMEN","descripcion":"Unidad de volumen","factorConversion":1,"esSI":false,"activo":true,"decimales":2},
  {"codigo":"UND","nombre":"Unidad","simbolo":"un","tipo":"CANTIDAD","descripcion":"Unidad de cantidad - Pieza","factorConversion":1,"esSI":false,"activo":true,"decimales":0},
  {"codigo":"HR","nombre":"Hora","simbolo":"h","tipo":"TIEMPO","descripcion":"Unidad de tiempo","factorConversion":3600,"esSI":false,"activo":true,"decimales":2}
]
'@

$unidadesArray = $unidades | ConvertFrom-Json
foreach ($u in $unidadesArray) {
    try {
        Write-Host "  Creando: $($u.nombre)..." -NoNewline
        $body = $u | ConvertTo-Json
        Invoke-RestMethod -Uri "$baseUrl/unidades-medida" -Method Post -ContentType "application/json" -Body $body | Out-Null
        Write-Host " OK" -ForegroundColor Green
    } catch {
        Write-Host " ERROR" -ForegroundColor Red
    }
}

# Operadores
Write-Host "`n[3/5] OPERADORES" -ForegroundColor Yellow
$operadores = @'
[
  {"codigo":"OP001","numeroEmpleado":"EMP-2024-001","nombre":"Juan","apellidos":"Garcia Lopez","email":"juan.garcia@empresa.com","telefono":"+34 600 123 456","estado":"ACTIVO","nivelHabilidad":"AVANZADO","departamento":"Produccion","puesto":"Operador de maquina CNC","fechaIngreso":"2022-01-15","certificaciones":["ISO 9001","Seguridad Industrial","CNC Basico"],"habilidades":["CNC","Soldadura","Control de calidad"]},
  {"codigo":"OP002","numeroEmpleado":"EMP-2024-002","nombre":"Maria","apellidos":"Rodriguez Sanchez","email":"maria.rodriguez@empresa.com","telefono":"+34 600 234 567","estado":"ACTIVO","nivelHabilidad":"EXPERTO","departamento":"Produccion","puesto":"Supervisora de linea","fechaIngreso":"2020-03-10","certificaciones":["Liderazgo","Six Sigma Green Belt","ISO 9001"],"habilidades":["Gestion de equipos","Lean Manufacturing","Resolucion de problemas"]},
  {"codigo":"OP003","numeroEmpleado":"EMP-2024-003","nombre":"Carlos","apellidos":"Martinez Perez","email":"carlos.martinez@empresa.com","telefono":"+34 600 345 678","estado":"ACTIVO","nivelHabilidad":"INTERMEDIO","departamento":"Mantenimiento","puesto":"Tecnico de mantenimiento","fechaIngreso":"2023-06-01","certificaciones":["Electricidad industrial","Mecanica basica"],"habilidades":["Mantenimiento preventivo","Diagnostico de fallas","Electricidad"]},
  {"codigo":"OP004","numeroEmpleado":"EMP-2024-004","nombre":"Ana","apellidos":"Torres Gomez","email":"ana.torres@empresa.com","telefono":"+34 600 456 789","estado":"ACTIVO","nivelHabilidad":"BASICO","departamento":"Calidad","puesto":"Inspector de calidad","fechaIngreso":"2024-01-10","certificaciones":["Metrologia","Control estadistico"],"habilidades":["Inspeccion visual","Uso de instrumentos de medicion","Documentacion"]}
]
'@

$operadoresArray = $operadores | ConvertFrom-Json
foreach ($o in $operadoresArray) {
    try {
        Write-Host "  Creando: $($o.nombre) $($o.apellidos)..." -NoNewline
        $body = $o | ConvertTo-Json -Depth 10
        Invoke-RestMethod -Uri "$baseUrl/operadores" -Method Post -ContentType "application/json" -Body $body | Out-Null
        Write-Host " OK" -ForegroundColor Green
    } catch {
        Write-Host " ERROR" -ForegroundColor Red
    }
}

# Motivos de Parada
Write-Host "`n[4/5] MOTIVOS DE PARADA" -ForegroundColor Yellow
$motivos = @'
[
  {"codigo":"MP001","nombre":"Falta de material","descripcion":"Parada por falta de materia prima o componentes","categoria":"MATERIALES","tipo":"MEDIA","requiereAprobacion":false,"requiereComentario":true,"requiereEvidencia":false,"color":"#e74c3c","icono":"box","tiempoEstandardMinutos":30,"prioridad":2,"impactaOEE":true,"departamentoResponsable":"Logistica","accionesCorrectivas":["Verificar stock","Contactar proveedor","Revisar planificacion"],"activo":true},
  {"codigo":"MP002","nombre":"Mantenimiento preventivo","descripcion":"Parada programada para mantenimiento preventivo","categoria":"PLANIFICADA","tipo":"LARGA","requiereAprobacion":true,"requiereComentario":true,"requiereEvidencia":true,"color":"#3498db","icono":"wrench","tiempoEstandardMinutos":120,"prioridad":3,"impactaOEE":false,"departamentoResponsable":"Mantenimiento","accionesCorrectivas":["Seguir plan de mantenimiento","Documentar actividades"],"activo":true},
  {"codigo":"MP003","nombre":"Cambio de formato","descripcion":"Parada por cambio de formato o setup de maquina","categoria":"PRODUCCION","tipo":"MEDIA","requiereAprobacion":false,"requiereComentario":false,"requiereEvidencia":false,"color":"#f39c12","icono":"gear","tiempoEstandardMinutos":45,"prioridad":3,"impactaOEE":true,"departamentoResponsable":"Produccion","accionesCorrectivas":["Optimizar tiempo de setup","SMED"],"activo":true},
  {"codigo":"MP004","nombre":"Falla mecanica","descripcion":"Parada por falla mecanica no planificada","categoria":"NO_PLANIFICADA","tipo":"LARGA","requiereAprobacion":false,"requiereComentario":true,"requiereEvidencia":true,"color":"#c0392b","icono":"warning","tiempoEstandardMinutos":90,"prioridad":1,"impactaOEE":true,"departamentoResponsable":"Mantenimiento","accionesCorrectivas":["Diagnosticar falla","Reparar componente","Analizar causa raiz"],"activo":true},
  {"codigo":"MP005","nombre":"Defecto de calidad","descripcion":"Parada por deteccion de defectos de calidad","categoria":"CALIDAD","tipo":"CORTA","requiereAprobacion":false,"requiereComentario":true,"requiereEvidencia":true,"color":"#e67e22","icono":"search","tiempoEstandardMinutos":20,"prioridad":1,"impactaOEE":true,"departamentoResponsable":"Calidad","accionesCorrectivas":["Revisar parametros","Ajustar proceso","Verificar especificaciones"],"activo":true}
]
'@

$motivosArray = $motivos | ConvertFrom-Json
foreach ($m in $motivosArray) {
    try {
        Write-Host "  Creando: $($m.nombre)..." -NoNewline
        $body = $m | ConvertTo-Json -Depth 10
        Invoke-RestMethod -Uri "$baseUrl/motivos-parada" -Method Post -ContentType "application/json" -Body $body | Out-Null
        Write-Host " OK" -ForegroundColor Green
    } catch {
        Write-Host " ERROR" -ForegroundColor Red
    }
}

# Procesos
Write-Host "`n[5/5] PROCESOS" -ForegroundColor Yellow
$procesos = @'
[
  {"codigo":"PROC-001","nombre":"Corte de material","descripcion":"Proceso de corte de materia prima segun especificaciones","tipo":"MANUFACTURA","estado":"ACTIVO","version":"1.0","tiempoEstandarMinutos":15.5,"tiempoSetupMinutos":10,"instrucciones":"1. Verificar dimensiones en plano\n2. Ajustar maquina\n3. Realizar corte\n4. Verificar medidas","requisitosCalidad":"Tolerancia ±0.5mm, sin rebabas","parametros":{"velocidad":"1500 rpm","avance":"100 mm/min","profundidad":"5 mm"},"recursos":["Sierra circular","Calibrador","Guantes de seguridad"],"habilidadesRequeridas":["Lectura de planos","Uso de maquinas de corte"],"secuencia":1,"puntosCriticos":["Verificacion de medidas","Control de rebabas"],"riesgos":["Cortes","Proyeccion de virutas"],"eficienciaEsperada":85,"costoEstandar":12.50},
  {"codigo":"PROC-002","nombre":"Mecanizado CNC","descripcion":"Proceso de mecanizado de precision con control numerico","tipo":"MANUFACTURA","estado":"ACTIVO","version":"2.1","tiempoEstandarMinutos":45,"tiempoSetupMinutos":30,"instrucciones":"1. Cargar programa CNC\n2. Montar pieza en fixture\n3. Verificar cero pieza\n4. Ejecutar programa\n5. Inspeccionar","requisitosCalidad":"Tolerancia ±0.01mm, Ra 1.6","parametros":{"velocidadHusillo":"3000 rpm","avance":"200 mm/min","refrigerante":"Soluble 5%"},"recursos":["Centro de mecanizado CNC","Herramientas de corte","Micrometro","Rugosimetro"],"habilidadesRequeridas":["Programacion CNC","Metrologia","Control numerico"],"secuencia":2,"puntosCriticos":["Cero pieza","Primera pieza","Control dimensional"],"riesgos":["Rotura de herramienta","Colision de husillo"],"eficienciaEsperada":92,"costoEstandar":85.00},
  {"codigo":"PROC-003","nombre":"Ensamble de subconjunto","descripcion":"Proceso de ensamble de componentes en subconjunto","tipo":"ENSAMBLE","estado":"ACTIVO","version":"1.5","tiempoEstandarMinutos":25,"tiempoSetupMinutos":5,"instrucciones":"1. Verificar componentes\n2. Limpiar superficies\n3. Aplicar adhesivo\n4. Ensamblar componentes\n5. Verificar ajuste","requisitosCalidad":"Sin juego, torque segun especificacion","parametros":{"torque":"25 Nm","adhesivo":"Loctite 243"},"recursos":["Torquimetro","Adhesivo","Estacion de ensamble"],"habilidadesRequeridas":["Ensamble de precision","Uso de torquimetro"],"secuencia":3,"puntosCriticos":["Limpieza de superficies","Aplicacion de torque correcto"],"riesgos":["Dano de roscas","Contaminacion"],"eficienciaEsperada":88,"costoEstandar":18.75}
]
'@

$procesosArray = $procesos | ConvertFrom-Json
foreach ($p in $procesosArray) {
    try {
        Write-Host "  Creando: $($p.nombre)..." -NoNewline
        $body = $p | ConvertTo-Json -Depth 10
        Invoke-RestMethod -Uri "$baseUrl/procesos" -Method Post -ContentType "application/json" -Body $body | Out-Null
        Write-Host " OK" -ForegroundColor Green
    } catch {
        Write-Host " ERROR" -ForegroundColor Red
    }
}

Write-Host "`n=== Poblacion completada ===" -ForegroundColor Cyan
