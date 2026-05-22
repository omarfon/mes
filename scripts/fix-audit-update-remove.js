const fs = require('fs');
const path = require('path');

const BASE = path.join(__dirname, '..', 'src', 'master-data');

const MODULES = {
  'locations':        { type: 'Location',       var: 'location',     repo: 'locationsRepo' },
  'material-lots':    { type: 'MaterialLot',     var: null,           repo: null }, // manual
  'materials':        { type: 'Material',        var: 'material',     repo: 'materialsRepo' },
  'motivos-parada':   { type: 'MotivoParada',    var: 'motivo',       repo: 'motivosRepo' },
  'movement-types':   { type: 'MovementType',    var: 'movementType', repo: 'movementTypesRepo' },
  'order-types':      { type: 'OrderType',       var: null,           repo: null },
  'plant-calendar':   { type: 'PlantCalendar',   var: null,           repo: null },
  'product-variants': { type: 'ProductVariant',  var: null,           repo: null },
  'products':         { type: 'Product',         var: 'product',      repo: 'productsRepo' },
  'routings':         { type: 'Routing',         var: null,           repo: null },
  'schift':           { type: 'Turn',            var: 'shift',        repo: 'shiftsRepo' },
  'scrap-reasons':    { type: 'ScrapReason',     var: null,           repo: null },
  'shift-groups':     { type: 'ShiftGroup',      var: null,           repo: null },
  'standard-times':   { type: 'StandardTime',    var: null,           repo: null },
  'work-centers':     { type: 'WorkCenter',      var: 'wc',           repo: 'workCentersRepo' },
  'workstations':     { type: 'Workstation',     var: null,           repo: null },
};

function processFile(folder, cfg) {
  const dir = path.join(BASE, folder);
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.service.ts') && !f.includes('spec'));
  if (!files.length) { console.log(`NOT FOUND: ${folder}`); return; }
  const file = path.join(dir, files[0]);
  let c = fs.readFileSync(file, 'utf8');

  const entityType = cfg.type;
  let changed = false;

  // ─── Fix UPDATE: change the final `return this.xRepo.save(x)` in update() to use const+audit ───
  // Strategy: find the update() method body and replace the LAST return-save pattern
  const updateMethodRe = /(\basync update\b[\s\S]*?\n  })\n/g;
  
  c = c.replace(updateMethodRe, (match) => {
    // Only if this update method doesn't already have AuditAction.UPDATE
    if (match.includes('AuditAction.UPDATE')) return match;
    
    // Find the last `return this.XRepo.save(varName);` in this method
    // Look for `return this.\w+.save(\w+);` pattern  
    const savePat = /return this\.(\w+)\.save\((\w+)\);(\s*\n  })/;
    if (!savePat.test(match)) {
      console.log(`  WARN: no save found in update() for ${folder}`);
      return match;
    }
    
    const fixed = match.replace(savePat, (m, repoName, varName, closing) => {
      return `const updated = await this.${repoName}.save(${varName});\n    await this.auditsService.create({ action: AuditAction.UPDATE, entityType: ENTITY_TYPE, entityId: id, userId, oldValues, newValues: updated, module: MODULE, description: \`${entityType} actualizado\`, ipAddress: ip });\n    return updated;${closing}`;
    });
    changed = true;
    return fixed;
  });

  // ─── Fix REMOVE: add audit call after softDelete if not present ───
  const removeMethodRe = /(\basync remove\b[\s\S]*?\n  })\n/g;
  
  c = c.replace(removeMethodRe, (match) => {
    if (match.includes('AuditAction.DELETE')) return match;
    
    // Find softDelete call and add audit after
    const softDelPat = /(await this\.(\w+)\.softDelete\((\w+)\.id\);)(\s*\n  })/;
    if (!softDelPat.test(match)) {
      // Try with variable just being `id`
      const softDelPat2 = /(await this\.(\w+)\.softDelete\((\w+)\);)(\s*\n  })/;
      if (softDelPat2.test(match)) {
        const fixed = match.replace(softDelPat2, (m, del, repo, varName, closing) => {
          return `${del}\n    await this.auditsService.create({ action: AuditAction.DELETE, entityType: ENTITY_TYPE, entityId: id, userId, oldValues: ${varName}, module: MODULE, description: \`${entityType} eliminado\`, ipAddress: ip });${closing}`;
        });
        changed = true;
        return fixed;
      }
      console.log(`  WARN: no softDelete found in remove() for ${folder}`);
      return match;
    }
    
    const fixed = match.replace(softDelPat, (m, del, repo, varName, closing) => {
      return `${del}\n    await this.auditsService.create({ action: AuditAction.DELETE, entityType: ENTITY_TYPE, entityId: id, userId, oldValues: ${varName}, module: MODULE, description: \`${entityType} eliminado\`, ipAddress: ip });${closing}`;
    });
    changed = true;
    return fixed;
  });

  if (changed) {
    fs.writeFileSync(file, c, 'utf8');
    console.log(`FIXED: ${folder}`);
  } else {
    console.log(`NO CHANGE: ${folder}`);
  }
}

for (const [folder, cfg] of Object.entries(MODULES)) {
  try {
    processFile(folder, cfg);
  } catch (err) {
    console.error(`ERROR ${folder}: ${err.message}`);
  }
}

console.log('\nDone.');
