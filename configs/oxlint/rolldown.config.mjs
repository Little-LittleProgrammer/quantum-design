import { defineRolldownLibraryConfig } from '@quantum-design-configs/rolldown';
import pkg from './package.json' with { type: 'json' };

export default defineRolldownLibraryConfig({
    entries: { name: 'index', input: './src/index.ts', dtsName: 'index' },
    formats: ['esm'],
    fileName: '[name].mjs',
    platform: 'node',
    minify: false,
    external: ['oxlint'],
    version: pkg.version,
    dts: { outDir: 'dist', tsconfig: './tsconfig.build.json' },
});
