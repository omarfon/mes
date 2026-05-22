const fs = require('fs');
const path = require('path');

const BASE = path.join(__dirname, '..', 'src', 'master-data');

const AUDIT_IMPORTS = `import { AuditsService } from '../../traceability/audits/audits.service';
import { AuditAction } from '../../traceability/audits/entities/audit.entity';`;

// folder -> entityType
const MODULES = {
  'empresas':         'Empresa',
  'locations':        'Location',
  'material-lots':    'MaterialLot',
  'materials':        'Material',
  'motivos-parada':   'MotivoParada',
  'movement-types':   'MovementType',
  'operadores':       'Operator',
  'order-types':      'OrderType',
  'plant-calendar':   'PlantCalendar',
  'procesos':         'Process',
  'products':         'Product',
  'product-variants': 'ProductVariant',
  'routings':         'Routing',
  'schift':           'Turn',
  'scrap-reasons':    'ScrapReason',
  'shift-groups':     'ShiftGroup',
  'standard-times':   'StandardTime',
  'suppliers':        'Supplier',
  'turnos':           'Turno',
  'unidades-medida':  'UnidadMedida',
  'work-centers':     'WorkCenter',
  'workstations':     'Workstation',
};

function getServiceFile(folder) {
  const dir = path.join(BASE, folder);
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.service.ts') && !f.includes('spec'));
  return files.length ? path.join(dir, files[0]) : null;
}

function processService(folder, entityType) {
  const file = getServiceFile(folder);
  if (!file) { console.log(`NOT FOUND: ${folder}`); return; }

  let c = fs.readFileSync(file, 'utf8');

  if (c.includes('AuditsService')) { console.log(`SKIP (done): ${folder}`); return; }

  // ─── 1. Add imports + constants before @Injectable() ─────────────────────
  c = c.replace(
    /(@Injectable\(\))/,
    `${AUDIT_IMPORTS}\n\nconst ENTITY_TYPE = '${entityType}';\nconst MODULE = 'master-data';\n\n$1`
  );

  // ─── 2. Inject AuditsService in constructor ───────────────────────────────
  // Pattern: last "@InjectRepository" repo param, then ) {
  c = c.replace(
    /(private readonly \w+Repo: Repository<\w+>,)\s*\n(\s*\) \{)/,
    `$1\n    private readonly auditsService: AuditsService,\n$2`
  );

  // ─── 3. Modify method signatures ─────────────────────────────────────────
  c = c.replace(/async create\(dto: Create\w+Dto\):/, 'async create(dto, userId?: string, ip?: string):');
  c = c.replace(/async update\(id: string, dto: Update\w+Dto\):/, 'async update(id: string, dto, userId?: string, ip?: string):');
  c = c.replace(/async remove\(id: string\):/, 'async remove(id: string, userId?: string, ip?: string):');

  // ─── 4. Add audit calls after SAVE in create() ───────────────────────────
  // Look for: const X = this.XRepo.create({...}); then return this.XRepo.save(X);
  // Replace the return with: const saved = await ...; audit; return saved;
  const createSaveRe = /(const (\w+) = this\.(\w+Repo)\.create\([\s\S]*?\n\s+\}\);\s*\n)\s*return this\.(\w+Repo)\.save\((\w+)\);(\s*\n  \})/;
  const createMatch = c.match(createSaveRe);
  if (createMatch) {
    const varName = createMatch[2];
    c = c.replace(createSaveRe,
      `$1    const saved = await this.$3.save(${varName});\n    await this.auditsService.create({ action: AuditAction.CREATE, entityType: ENTITY_TYPE, entityId: saved.id, userId, newValues: saved, module: MODULE, description: \`${entityType} creado\`, ipAddress: ip });\n    return saved;$6`
    );
  } else {
    // Alternative: return this.XRepo.save(dto-based) — e.g. operadores/procesos: const X = this.XRepo.create(dto);
    const simpleSaveRe = /(const (\w+) = this\.(\w+Repo)\.create\(dto\);\s*\n\s*)return this\.(\w+Repo)\.save\((\w+)\);(\s*\n  \})/;
    const simpleMatch = c.match(simpleSaveRe);
    if (simpleMatch) {
      const varName = simpleMatch[2];
      c = c.replace(simpleSaveRe,
        `$1const saved = await this.$3.save(${varName});\n    await this.auditsService.create({ action: AuditAction.CREATE, entityType: ENTITY_TYPE, entityId: saved.id, userId, newValues: saved, module: MODULE, description: \`${entityType} creado\`, ipAddress: ip });\n    return saved;$6`
      );
    } else {
      console.log(`  WARN: could not patch create() for ${folder}`);
    }
  }

  // ─── 5. Add oldValues + audit in update() ────────────────────────────────
  // Pattern: Object.assign(X, ...) then return this.XRepo.save(X);
  // We need to:
  //   a) Add const oldValues = {...X}; before Object.assign
  //   b) Change return this.XRepo.save(X); to const updated = await ...; audit; return updated;
  const updateObjAssignRe = /(const (\w+) = await this\.findOne\(id\);)\s*\n/;
  const updateMatch = c.match(updateObjAssignRe);
  if (updateMatch) {
    // After findOne in update, capture variable name
    const varName = updateMatch[2];
    // Find the Object.assign + save pattern in the update method
    const objAssignRe = new RegExp(
      `(Object\\.assign\\(${varName}(?:,|[^)]+)\\);\\s*\\n\\s*)return this\\.(\\w+Repo)\\.save\\(${varName}\\);(\\s*\\n  \\})`,
      's'
    );
    c = c.replace(objAssignRe,
      `$1const updated = await this.$2.save(${varName});\n    await this.auditsService.create({ action: AuditAction.UPDATE, entityType: ENTITY_TYPE, entityId: id, userId, oldValues, newValues: updated, module: MODULE, description: \`${entityType} actualizado\`, ipAddress: ip });\n    return updated;$3`
    );

    // Add const oldValues = {...varName}; right after findOne in update
    // Find: "const varName = await this.findOne(id);\n" in update method context
    // This is complex - look for it in the update method
    const oldValuesRe = new RegExp(`(async update\\([^)]+\\)[^{]+\\{[\\s\\S]*?const ${varName} = await this\\.findOne\\(id\\);)`, 's');
    c = c.replace(oldValuesRe, `$1\n    const oldValues = { ...${varName} };`);
  } else {
    console.log(`  WARN: could not patch update() for ${folder}`);
  }

  // ─── 6. Add audit in remove() ────────────────────────────────────────────
  // Pattern: await this.XRepo.softDelete(X.id);
  const removeRe = /(const (\w+) = await this\.findOne\(id\);\s*\n\s*)await this\.(\w+Repo)\.softDelete\(\w+\.id\);(\s*\n  \})/s;
  const removeMatch = c.match(removeRe);
  if (removeMatch) {
    const varName = removeMatch[2];
    c = c.replace(removeRe,
      `$1await this.$3.softDelete(${varName}.id);\n    await this.auditsService.create({ action: AuditAction.DELETE, entityType: ENTITY_TYPE, entityId: id, userId, oldValues: ${varName}, module: MODULE, description: \`${entityType} eliminado\`, ipAddress: ip });$4`
    );
  } else {
    console.log(`  WARN: could not patch remove() for ${folder}`);
  }

  fs.writeFileSync(file, c, 'utf8');
  console.log(`UPDATED: ${folder}`);
}

// Process all modules
for (const [folder, entityType] of Object.entries(MODULES)) {
  try {
    processService(folder, entityType);
  } catch (err) {
    console.error(`ERROR in ${folder}: ${err.message}`);
  }
}

console.log('\nDone. Run: npx tsc --noEmit');
