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
  
  // Fix malformed: '} Request,\n  Request,\n} from' -> '  Request,\n} from'
  const bad1 = '} Request,\n  Request,\n} from \'@nestjs/common\';';
  const bad2 = '} Request,\n} from \'@nestjs/common\';';
  const good = '  Request,\n} from \'@nestjs/common\';';
  
  if (c.includes(bad1)) {
    c = c.replace(bad1, good);
    fs.writeFileSync(file, c, 'utf8');
    console.log('FIXED (double): ' + folder);
  } else if (c.includes(bad2)) {
    c = c.replace(bad2, good);
    fs.writeFileSync(file, c, 'utf8');
    console.log('FIXED (single): ' + folder);
  } else if (c.includes('Request,\n} from \'@nestjs/common\';')) {
    console.log('OK: ' + folder);
  } else {
    console.log('UNKNOWN state: ' + folder);
    // Show the import section
    const endImport = c.indexOf('} from \'@nestjs/common\';');
    if (endImport > -1) console.log('  import end:', c.substring(Math.max(0, endImport-100), endImport+30).replace(/\n/g, '\\n'));
  }
}
console.log('Done.');
