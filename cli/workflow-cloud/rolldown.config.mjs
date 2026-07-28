import { defineRolldownLibraryConfig } from '@quantum-design-configs/rolldown';
import pkg from './package.json' with { type: 'json' };

export default defineRolldownLibraryConfig({
    entries: [
        { name: 'cli', input: './src/cli.ts' },
        { name: 'tools', input: './src/tools.ts' },
    ],
    formats: ['esm'],
    fileName: '[name].mjs',
    platform: 'node',
    target: 'node16',
    minify: true,
    version: pkg.version,
});
