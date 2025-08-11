import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const path = resolve(process.cwd(), 'pnpm-lock.yaml');
const txt = readFileSync(path, 'utf8');
const lines = txt.split(/\r?\n/);

const nameToVersions = new Map();
let inPackages = false;

for (const line of lines) {
    if (!inPackages) {
        if (/^packages:\s*$/.test(line)) inPackages = true;
        continue;
    }
    if (/^(?:snapshots:|importers:|overrides:|dependencies:|devDependencies:|optionalDependencies:)\s*$/.test(line)) {
        // 到达下一个顶级段落，结束
        inPackages = false;
        continue;
    }
    const m = line.match(/^\s{2,}(?:'|")?([^'":]+)(?:'|")?:/);
    if (m) {
        let key = m[1];
        key = key.replace(/\([^)]*\)$/, ''); // 去掉末尾的 (peer deps)
        const at = key.lastIndexOf('@');
        if (at > 0) {
            const name = key.slice(0, at);
            const ver = key.slice(at + 1);
            if (!nameToVersions.has(name)) nameToVersions.set(name, new Set());
            nameToVersions.get(name).add(ver);
        }
    }
}

const result = [...nameToVersions.entries()]
    .map(([name, set]) => ({ name, versions: [...set].sort() }))
    .filter((x) => x.versions.length > 1)
    .sort((a, b) => b.versions.length - a.versions.length || a.name.localeCompare(b.name));

// 输出到文件
writeFileSync(resolve(process.cwd(), 'scripts/checkout-duplicates/check-lock-duplicates.json'), JSON.stringify({ total: result.length, items: result }, null, 2));
