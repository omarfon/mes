const fs = require('fs');
const path = require('path');
const BASE = 'src/master-data';
const folders = ['empresas','locations','material-lots','materials','motivos-parada','movement-types','operadores','order-types','plant-calendar','procesos','products','product-variants','routings','schift','scrap-reasons','shift-groups','standard-times','suppliers','turnos','unidades-medida','work-centers','workstations'];

for (const folder of folders) {
  const dir = path.join(BASE, folder);
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.controller.ts') && !f.includes('spec'));
  if (!files.length) continue;
  const file = path.join(dir, files[0]);
  let c = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Fix multi-line update/patch methods:
  // Pattern: @Body() dto: UpdateXDto,\n  ) {
  // Add @Request() req as extra parameter
  const multiBodyPat = /(@Body\(\) dto: Update\w+Dto),\s*\n(\s*\) \{)/g;
  if (multiBodyPat.test(c)) {
    c = c.replace(/(@Body\(\) dto: Update\w+Dto),\s*\n(\s*\) \{)/g, '$1,\n    @Request() req,\n$2');
    changed = true;
  }

  // Fix multi-line remove method that doesn't have @Request() req:
  // Pattern: async remove/softDelete(\n    @Param(...) id: string,\n  ) {
  // Two forms:
  // 1. async remove(@Param('id', ...) id: string) { -> add @Request() req
  // 2. async remove(@Param... id: string, @Request() req) { -> already done
  
  // Single-line remove without @Request:
  // async remove(@Param('id', new ParseUUIDPipe()) id: string) {
  const singleRemovePat = /async (remove|softDelete)\(@Param\('id', new ParseUUIDPipe\(\)\) id: string\) \{/g;
  if (singleRemovePat.test(c)) {
    c = c.replace(/async (remove|softDelete)\(@Param\('id', new ParseUUIDPipe\(\)\) id: string\) \{/g,
      'async $1(@Param(\'id\', new ParseUUIDPipe()) id: string, @Request() req) {');
    changed = true;
  }

  // Check if req is still missing from service calls
  // service.update(id, dto, req...) but method signature still doesn't have req
  // Detect: service call has req.user but the enclosing method doesn't have @Request() req param
  
  if (changed) {
    fs.writeFileSync(file, c, 'utf8');
    console.log('FIXED: ' + folder);
  } else {
    console.log('NO CHANGE: ' + folder);
  }
}
console.log('Done.');
