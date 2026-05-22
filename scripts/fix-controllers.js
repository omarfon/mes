const fs = require('fs');
const path = require('path');

const BASE = path.join(__dirname, '..', 'src', 'master-data');

const FOLDERS = [
  'empresas', 'locations', 'material-lots', 'materials', 'motivos-parada',
  'movement-types', 'operadores', 'order-types', 'plant-calendar', 'procesos',
  'products', 'product-variants', 'routings', 'schift', 'scrap-reasons',
  'shift-groups', 'standard-times', 'suppliers', 'turnos', 'unidades-medida',
  'work-centers', 'workstations',
];

function getControllerFile(folder) {
  const dir = path.join(BASE, folder);
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.controller.ts') && !f.includes('spec'));
  return files.length ? path.join(dir, files[0]) : null;
}

for (const folder of FOLDERS) {
  const file = getControllerFile(folder);
  if (!file) { console.log(`NOT FOUND: ${folder}`); continue; }
  
  let c = fs.readFileSync(file, 'utf8');
  
  // Skip if already has @Request() req
  if (c.includes('@Request() req') || c.includes('@Req() req')) {
    console.log(`SKIP (done): ${folder}`);
    continue;
  }

  let changed = false;

  // 1. Add Request to @nestjs/common imports
  if (!c.includes("Request,") && !c.includes(" Request\n")) {
    // Add before the closing } of the import from @nestjs/common
    c = c.replace(
      /from '@nestjs\/common';/,
      `Request,\n} from '@nestjs/common';`
    );
    // But this might double-close. Better approach: insert Request before closing brace
    // Reset - use simpler replacement: add Request to existing import
    // Find the import block and add Request to it
    c = c.replace(
      "} from '@nestjs/common';",
      "  Request,\n} from '@nestjs/common';"
    );
    changed = true;
  }

  // 2. Patch create method: @Post()\n  async create(@Body() dto: XDto) 
  //    -> @Post()\n  async create(@Body() dto: XDto, @Request() req)
  //    and service call: service.create(dto) -> service.create(dto, req.user?.userId, req.ip)
  
  // Pattern: create(@Body() dto: XDto) -> create(@Body() dto: XDto, @Request() req)
  // Handle both single-line and multi-line
  c = c.replace(
    /(@Body\(\) dto: \w+)\)/g,
    (match, group) => {
      // Only add @Request() req if not already there
      if (match.includes('@Request')) return match;
      return `${group}, @Request() req)`;
    }
  );

  // Patch service.create(dto) call -> service.create(dto, req.user?.userId, req.ip)
  // Find all service.create(dto) patterns in the controller
  c = c.replace(
    /(\w+Service)\.create\(dto\)/g,
    '$1.create(dto, req.user?.userId, req.ip)'
  );

  // 3. Patch update/patch methods
  // Pattern: update(id, dto) / update(id, dto, ...) 
  // In controllers, find: @Param... id, @Body() dto: UpdateXDto) -> add @Request() req
  c = c.replace(
    /(@Body\(\) dto: Update\w+)\)/g,
    (match, group) => `${group}, @Request() req)`
  );
  // Patch service.update(id, dto) -> service.update(id, dto, req.user?.userId, req.ip)
  c = c.replace(
    /(\w+Service)\.update\(id, dto\)/g,
    '$1.update(id, dto, req.user?.userId, req.ip)'
  );

  // 4. Patch remove/softDelete methods - find @Param id: string) then the service.remove call
  // Pattern: async remove(@Param('id', ...) id: string) -> add @Request() req
  c = c.replace(
    /(async (?:remove|softDelete)\s*\(@Param\([^)]+\)\s+id:\s+string)\)/g,
    '$1, @Request() req)'
  );
  // Patch service.remove(id) -> service.remove(id, req.user?.userId, req.ip)
  c = c.replace(
    /(\w+Service)\.(remove|softDelete)\(id\)/g,
    '$1.$2(id, req.user?.userId, req.ip)'
  );

  if (changed || c !== fs.readFileSync(file, 'utf8')) {
    fs.writeFileSync(file, c, 'utf8');
    console.log(`UPDATED: ${folder}`);
  } else {
    console.log(`NO CHANGE: ${folder}`);
  }
}

console.log('\nDone.');
