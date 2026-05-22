const fs = require('fs');
const path = require('path');

const BASE = path.join(__dirname, '..', 'src', 'master-data');

// For each module: find return-save in update() and softDelete in remove() and add audit
// entityType: string for audit records
// The script reads the file, finds the patterns and replaces them

const CONFIGS = [
  // folder, entityType
  ['locations', 'Location'],
  ['material-lots', 'MaterialLot'],
  ['materials', 'Material'],
  ['motivos-parada', 'MotivoParada'],
  ['movement-types', 'MovementType'],
  ['order-types', 'OrderType'],
  ['plant-calendar', 'PlantCalendar'],
  ['product-variants', 'ProductVariant'],
  ['products', 'Product'],
  ['routings', 'Routing'],
  ['schift', 'Turn'],
  ['scrap-reasons', 'ScrapReason'],
  ['shift-groups', 'ShiftGroup'],
  ['standard-times', 'StandardTime'],
  ['work-centers', 'WorkCenter'],
  ['workstations', 'Workstation'],
];

function buildAuditUpdate(repoVar, entityVar, entityType) {
  return `const updated = await this.${repoVar}.save(${entityVar});
    await this.auditsService.create({ action: AuditAction.UPDATE, entityType: ENTITY_TYPE, entityId: id, userId, oldValues, newValues: updated, module: MODULE, description: \`${entityType} actualizado\`, ipAddress: ip });
    return updated;`;
}

function buildAuditDelete(entityVar, entityType) {
  return `await this.auditsService.create({ action: AuditAction.DELETE, entityType: ENTITY_TYPE, entityId: id, userId, oldValues: ${entityVar}, module: MODULE, description: \`${entityType} eliminado\`, ipAddress: ip });`;
}

for (const [folder, entityType] of CONFIGS) {
  const dir = path.join(BASE, folder);
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.service.ts') && !f.includes('spec'));
  if (!files.length) { console.log(`NOT FOUND: ${folder}`); continue; }
  
  const file = path.join(dir, files[0]);
  let c = fs.readFileSync(file, 'utf8');
  
  const hasUpdate = c.includes('AuditAction.UPDATE');
  const hasDelete = c.includes('AuditAction.DELETE');
  
  if (hasUpdate && hasDelete) { console.log(`SKIP (complete): ${folder}`); continue; }
  
  let changed = false;
  
  // ─── FIX UPDATE ──────────────────────────────────────────────────────────
  if (!hasUpdate) {
    // Find pattern: return this.REPO.save(VAR);\n  }\n\n  async remove
    // The closing brace pattern for update method ends with \n  }\n
    // We distinguish create vs update by checking what comes AFTER the method
    
    // Strategy: find "async update(" in the file, then navigate to find the save call
    const updateStart = c.indexOf('async update(');
    if (updateStart === -1) { console.log(`  NO update() found: ${folder}`); }
    else {
      // Find next "async " that comes after the update method
      const nextAsync = c.indexOf('\n  async ', updateStart + 1);
      const updateBody = nextAsync > -1 ? c.substring(updateStart, nextAsync) : c.substring(updateStart);
      
      // Find the repo.save(var) pattern in the update body
      const savePat = /return this\.(\w+)\.save\((\w+)\);/;
      const saveMatch = updateBody.match(savePat);
      
      if (saveMatch) {
        const repoVar = saveMatch[1];
        const entityVar = saveMatch[2];
        const oldStr = `return this.${repoVar}.save(${entityVar});`;
        const newStr = buildAuditUpdate(repoVar, entityVar, entityType);
        
        // Only replace the one INSIDE the update method
        const updateSection = c.substring(updateStart, nextAsync > -1 ? nextAsync : c.length);
        const fixedSection = updateSection.replace(oldStr, newStr);
        
        if (fixedSection !== updateSection) {
          c = c.substring(0, updateStart) + fixedSection + (nextAsync > -1 ? c.substring(nextAsync) : '');
          changed = true;
          console.log(`  Fixed update() [${entityVar}/${repoVar}]: ${folder}`);
        } else {
          console.log(`  WARN: update() replace failed: ${folder}`);
        }
      } else {
        console.log(`  WARN: no save found in update(): ${folder}`);
        // Try to show context
        const excerpt = updateBody.substring(Math.max(0, updateBody.length - 200));
        console.log(`  Last 200 chars of update():`, excerpt.substring(0, 100).replace(/\n/g, '\\n'));
      }
    }
  }
  
  // ─── FIX REMOVE ──────────────────────────────────────────────────────────
  if (!hasDelete) {
    const removeStart = c.indexOf('async remove(');
    if (removeStart === -1) { console.log(`  NO remove() found: ${folder}`); }
    else {
      const nextAsync = c.indexOf('\n  async ', removeStart + 1);
      const removeBody = nextAsync > -1 ? c.substring(removeStart, nextAsync) : c.substring(removeStart);
      
      // Find softDelete call and entity variable
      const sdPat = /const (\w+) = await this\.findOne\(id\);\s*\n\s*await this\.(\w+)\.softDelete\(\w+\.id\);/;
      const sdMatch = removeBody.match(sdPat);
      
      if (sdMatch) {
        const entityVar = sdMatch[1];
        const sdLine = `await this.${sdMatch[2]}.softDelete(${entityVar}.id);`;
        const auditLine = buildAuditDelete(entityVar, entityType);
        
        const removeSection = c.substring(removeStart, nextAsync > -1 ? nextAsync : c.length);
        const fixedSection = removeSection.replace(sdLine, `${sdLine}\n    ${auditLine}`);
        
        if (fixedSection !== removeSection) {
          c = c.substring(0, removeStart) + fixedSection + (nextAsync > -1 ? c.substring(nextAsync) : '');
          changed = true;
          console.log(`  Fixed remove() [${entityVar}]: ${folder}`);
        } else {
          console.log(`  WARN: remove() replace failed: ${folder}`);
        }
      } else {
        console.log(`  WARN: no softDelete pattern in remove(): ${folder}`);
        const excerpt = removeBody.substring(0, 300);
        console.log(`  remove() start:`, excerpt.replace(/\n/g, '\\n').substring(0, 200));
      }
    }
  }
  
  if (changed) {
    fs.writeFileSync(file, c, 'utf8');
    console.log(`SAVED: ${folder}`);
  } else {
    console.log(`NO CHANGE: ${folder}`);
  }
}

console.log('\nDone.');
