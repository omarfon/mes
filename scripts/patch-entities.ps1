####################################################################
# patch-entities.ps1 — PowerShell 5.1 compatible
# Aplica AuditableEntity a todas las entidades del proyecto MES.
####################################################################
param(
  [string]$SrcRoot = "C:\Users\ASUS\Documents\DESARROLLO\BACKEND\mes\src"
)

$Exclude = @(
  "auditable.entity.ts",
  "activity-log.entity.ts",
  "auth.entity.ts"
)

function Get-RelPath([string]$fromDir, [string]$toFile) {
  # Normaliza separadores
  $a = $fromDir.TrimEnd('\').Split('\')
  $b = $toFile.Split('\')
  $common = 0
  $min = [Math]::Min($a.Length, $b.Length)
  for ($i = 0; $i -lt $min; $i++) {
    if ($a[$i] -ieq $b[$i]) { $common++ } else { break }
  }
  $ups   = $a.Length - $common
  $downs = $b[$common..($b.Length - 1)]
  # Construir con '..' (sin trailing slash para evitar dobles slashes al join)
  $parts = @()
  for ($i = 0; $i -lt $ups; $i++) { $parts += '..' }
  $parts += $downs
  $rel = ($parts -join '/')
  if (-not $rel.StartsWith('.')) { $rel = "./$rel" }
  return $rel
}

$auditablePath = "$SrcRoot\common\entities\auditable.entity.ts"
$ok = 0; $skip = 0

$entities = Get-ChildItem -Path $SrcRoot -Recurse -Filter "*.entity.ts" |
  Where-Object { $Exclude -notcontains $_.Name }

foreach ($file in $entities) {
  $raw = Get-Content $file.FullName -Raw

  # ── Limpiar import vacío dejado por ejecución anterior ───────
  $raw = $raw -replace "import \{ AuditableEntity \} from '';\r?\n", ''

  # ── Saltar si ya correctamente parcheada (import con ruta) ──
  if ($raw -match "extends AuditableEntity" -and $raw -match "import \{ AuditableEntity \} from '[^']") {
    Write-Host "  SKIP: $($file.Name)" -ForegroundColor DarkGray
    $skip++
    continue
  }

  # ── Calcular ruta relativa ───────────────────────────────────
  $targetNoExt = $auditablePath -replace '\.ts$', ''
  $relPath = Get-RelPath $file.DirectoryName $targetNoExt
  $relPath = $relPath -replace '\\', '/'
  $importLine = "import { AuditableEntity } from '$relPath';"

  # ── Insertar import debajo de la primera línea de import ────
  if ($raw -notmatch "import \{ AuditableEntity \}") {
    if ($raw -match "^(import [^\r\n]+[\r\n]+)") {
      $firstImport = $Matches[1]
      $raw = $raw.Replace($firstImport, "$firstImport$importLine`n")
    } else {
      $raw = "$importLine`n$raw"
    }
  }

  # ── Agregar extends AuditableEntity (solo si no tiene base) ─
  $raw = $raw -replace 'export class (\w+) \{', 'export class $1 extends AuditableEntity {'

  # ── Eliminar @CreateDateColumn / @UpdateDateColumn / @DeleteDateColumn ──
  # Quitar importaciones de esos decoradores de la línea TypeORM
  $raw = $raw -replace ',\s*CreateDateColumn', ''
  $raw = $raw -replace ',\s*UpdateDateColumn', ''
  $raw = $raw -replace ',\s*DeleteDateColumn', ''
  $raw = $raw -replace 'CreateDateColumn\s*,\s*', ''
  $raw = $raw -replace 'UpdateDateColumn\s*,\s*', ''
  $raw = $raw -replace 'DeleteDateColumn\s*,\s*', ''

  # Quitar bloques decorador+propiedad: @CreateDateColumn(...) \n  prop: Date;
  $raw = $raw -replace '(?s)\s*@CreateDateColumn\([^)]*\)\r?\n\s+\w+:\s*Date;', ''
  $raw = $raw -replace '(?s)\s*@UpdateDateColumn\([^)]*\)\r?\n\s+\w+:\s*Date;', ''
  $raw = $raw -replace '(?s)\s*@DeleteDateColumn\([^)]*\)\r?\n\s+\w+[?]?:\s*Date(\s*\|\s*null)?;', ''

  # Limpiar imports vacíos: { Column, } → { Column }
  $raw = $raw -replace '\{\s*,', '{'
  $raw = $raw -replace ',\s*\}', ' }'
  $raw = $raw -replace ',\s*,', ','

  Set-Content $file.FullName $raw -NoNewline
  Write-Host "  OK: $($file.Name)" -ForegroundColor Green
  $ok++
}

Write-Host ""
Write-Host "════════ Resultado: OK=$ok  SKIP=$skip ════════" -ForegroundColor Cyan

