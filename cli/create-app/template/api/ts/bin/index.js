const fs = require('fs');
const path = require('path');

const pwd = path.resolve(process.cwd(), '.');
const files = fs.readdirSync(pwd);
const tsFiles = files.filter(file => path.extname(file) === '.ts');
const outputPath = path.resolve(process.cwd(), '.', 'index.ts');
let str = '';
for (const c of tsFiles) {
    if (c.includes('index') || c.includes('.client')) {
        continue;
    }
    const idx = c.lastIndexOf('.');
    const name = c.slice(0, idx);
    str += `export * from './${name}';`;
}
fs.writeFileSync(outputPath, str, 'utf8');
