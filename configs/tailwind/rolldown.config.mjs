import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineRolldownLibraryConfig } from '@quantum-design-configs/rolldown';
import pkg from './package.json' with { type: 'json' };

const packageDir = path.dirname(fileURLToPath(import.meta.url));
const templatePath = path.join(packageDir, 'src/index.template.ts');
const generatedPath = path.join(packageDir, 'src/index.ts');
const workspaceReplacement = `packages.forEach((pkg) => {
    if (pkg.dir.includes('apps') || pkg.dir.includes('packages/vue3-antd-pc-ui') || pkg.dir.includes('packages/vue3-pc-ui') || pkg.dir.includes('packages/styles')) {
        tailwindPackages.push(path.join(pkg.dir, 'src/**/*.{vue,js,ts,jsx,tsx,svelte,astro,html}'));
    }
});`;
const publishedReplacement = `['./src/**/*.{vue,js,ts,jsx,tsx,html,css,scss}', './node_modules/@quantum-design/vue3-antd-pc-ui/dist/**/*.{vue,js,ts,jsx,tsx,css,scss,html}', './node_modules/@quantum-design/vue3-pc-ui/dist/**/*.{vue,js,ts,jsx,tsx,svelte,astro,html}', './node_modules/@quantum-design/styles/**/*.{css,scss}'].forEach((item) => {
    tailwindPackages.push(item);
});`;

const source = fs.readFileSync(templatePath, 'utf8').replace('/** need-replace */', process.env.NODE_ENV === 'stub' ? workspaceReplacement : publishedReplacement);
fs.writeFileSync(generatedPath, source, 'utf8');
process.once('exit', () => fs.rmSync(generatedPath, { force: true }));

export default defineRolldownLibraryConfig({
    entries: [
        { name: 'index', input: './src/index.ts', dtsName: 'index' },
        { name: 'postcss.config', input: './src/postcss.config.ts', dtsName: 'postcss.config' },
    ],
    formats: ['esm', 'cjs'],
    fileName: ({ entry, format }) => `${entry.name}.${format === 'esm' ? 'mjs' : 'cjs'}`,
    platform: 'node',
    minify: false,
    version: pkg.version,
    dts: {
        outDir: 'dist/types',
        tsconfig: './tsconfig.build.json',
        external: [
            'tailwindcss',
            'postcss',
            '@manypkg/get-packages',
            'tailwindcss-animate',
            'autoprefixer',
            'cssnano',
            'postcss-antd-fixes',
            'postcss-import',
            'postcss-preset-env',
        ],
    },
});
