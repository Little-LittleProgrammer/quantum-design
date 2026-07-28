import { defineRolldownLibraryConfig } from '@quantum-design-configs/rolldown';
import pkg from './package.json' with { type: 'json' };

export default defineRolldownLibraryConfig({
    entries: { name: 'index', input: './src/index.ts' },
    formats: ['esm'],
    fileName: '[name].mjs',
    platform: 'node',
    target: 'node22',
    minify: true,
    version: pkg.version,
});
