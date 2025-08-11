import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { resolve } from 'node:path';

// 简易 semver 解析与比较（优先稳定版，大版本/小版本/补丁排序；预发布次之）
function parseSemver(v) {
    const m = v.match(/^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Z.-]+))?$/i);
    if (!m) return null;
    return {
        major: Number(m[1]),
        minor: Number(m[2]),
        patch: Number(m[3]),
        prerelease: m[4] || '',
    };
}

function cmpSemver(a, b) {
    const pa = parseSemver(a);
    const pb = parseSemver(b);
    if (!pa && !pb) return a.localeCompare(b);
    if (!pa) return -1;
    if (!pb) return 1;
    if (pa.major !== pb.major) return pa.major - pb.major;
    if (pa.minor !== pb.minor) return pa.minor - pb.minor;
    if (pa.patch !== pb.patch) return pa.patch - pb.patch;
    // 稳定版优先于预发布
    if (!!pa.prerelease && !pb.prerelease) return -1;
    if (!pa.prerelease && !!pb.prerelease) return 1;
    return pa.prerelease.localeCompare(pb.prerelease);
}

function pickMax(versions) {
    const stable = versions.filter((v) => parseSemver(v) && !parseSemver(v).prerelease);
    if (stable.length > 0) return stable.sort(cmpSemver).at(-1);
    return versions.sort(cmpSemver).at(-1);
}

function groupBy(items, keyFn) {
    const map = new Map();
    for (const it of items) {
        const k = keyFn(it);
        const arr = map.get(k) || [];
        arr.push(it);
        map.set(k, arr);
    }
    return map;
}

const ROOT = '/Users/qimao/Desktop/github/monorepo';
const LOCK_STATS = resolve(ROOT, 'scripts/checkout-duplicates/check-lock-duplicates.json');
const PKG_JSON = resolve(ROOT, 'package.json');

const stats = JSON.parse(readFileSync(LOCK_STATS, 'utf8'));
const pkg = JSON.parse(readFileSync(PKG_JSON, 'utf8'));

// 构建链：激进统一到最高版（显著减重）
const aggressiveMatchers = [/^esbuild$/, /^@esbuild\//, /^rollup$/, /^@rollup\//, /^vite$/];

function isAggressiveTarget(name) {
    return aggressiveMatchers.some((re) => re.test(name));
}

const overrides = {};

for (const item of stats.items) {
    const name = item.name;
    const vers = item.versions.slice().sort(cmpSemver);

    if (isAggressiveTarget(name)) {
        // 激进：强制到全局最高版本
        const max = pickMax(vers);
        overrides[name] = max; // 不加范围，直接全局锁定
        continue;
    }

    // 安全：
    // - 对于 major >= 1：按大版本合并到该大版本最高小版本
    // - 对于 major == 0：按“次版本”合并（^0.minor.0），提升到该 minor 最高补丁
    const parsed = vers.map((v) => ({ v, p: parseSemver(v) })).filter((x) => x.p);

    const byMajor = groupBy(parsed, (x) => x.p.major);
    for (const [majorStr, list] of byMajor.entries()) {
        const major = Number(majorStr);
        if (major === 0) {
            const byMinor = groupBy(list, (x) => x.p.minor);
            for (const [minorStr, lst] of byMinor.entries()) {
                const max = pickMax(lst.map((x) => x.v));
                const key = `${name}@^0.${minorStr}.0`;
                overrides[key] = max;
            }
        } else {
            const max = pickMax(list.map((x) => x.v));
            const key = `${name}@^${major}`;
            overrides[key] = max;
        }
    }
}

// 写回 package.json，备份
const backupPath = resolve(ROOT, 'package.backup.before-overrides.json');
copyFileSync(PKG_JSON, backupPath);

pkg.pnpm = pkg.pnpm || {};
pkg.pnpm.overrides = { ...(pkg.pnpm.overrides || {}), ...overrides };

writeFileSync(PKG_JSON, JSON.stringify(pkg, null, 2) + '\n', 'utf8');

console.log(`overrides 写入完成。共 ${Object.keys(overrides).length} 条。备份: ${backupPath}`);
